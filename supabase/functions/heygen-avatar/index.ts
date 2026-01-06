import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAvatarRequest {
  videoUrl: string;
  avatarName: string;
}

interface GenerateVideoRequest {
  avatarId: string;
  script: string;
  voiceId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HEYGEN_API_KEY = Deno.env.get("HEYGEN_API_KEY");
    
    if (!HEYGEN_API_KEY) {
      console.error("HEYGEN_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "HeyGen API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, ...data } = await req.json();
    console.log(`HeyGen action: ${action}`);

    switch (action) {
      case "list_avatars": {
        // List available avatars
        const response = await fetch("https://api.heygen.com/v2/avatars", {
          method: "GET",
          headers: {
            "X-Api-Key": HEYGEN_API_KEY,
            "Content-Type": "application/json",
          },
        });

        const avatars = await response.json();
        console.log("Avatars fetched:", avatars?.data?.avatars?.length || 0);
        
        return new Response(
          JSON.stringify(avatars),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "list_voices": {
        // List available voices
        const response = await fetch("https://api.heygen.com/v2/voices", {
          method: "GET",
          headers: {
            "X-Api-Key": HEYGEN_API_KEY,
            "Content-Type": "application/json",
          },
        });

        const voices = await response.json();
        console.log("Voices fetched:", voices?.data?.voices?.length || 0);
        
        return new Response(
          JSON.stringify(voices),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create_avatar": {
        // Upload video and create a new avatar
        const { videoUrl, avatarName } = data as CreateAvatarRequest;
        
        if (!videoUrl || !avatarName) {
          return new Response(
            JSON.stringify({ error: "videoUrl and avatarName are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Creating avatar: ${avatarName}`);

        // First, upload the video to get a training video URL
        // HeyGen requires videos to be accessible via URL
        const createResponse = await fetch("https://api.heygen.com/v2/avatars/instant", {
          method: "POST",
          headers: {
            "X-Api-Key": HEYGEN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_url: videoUrl,
            avatar_name: avatarName,
          }),
        });

        const result = await createResponse.json();
        console.log("Avatar creation result:", result);

        if (!createResponse.ok) {
          return new Response(
            JSON.stringify({ error: result.message || "Failed to create avatar", details: result }),
            { status: createResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "generate_video": {
        // Generate video with avatar
        const { avatarId, script, voiceId } = data as GenerateVideoRequest;
        
        if (!avatarId || !script) {
          return new Response(
            JSON.stringify({ error: "avatarId and script are required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Generating video for avatar: ${avatarId}`);

        const videoPayload: any = {
          video_inputs: [
            {
              character: {
                type: "avatar",
                avatar_id: avatarId,
                avatar_style: "normal",
              },
              voice: {
                type: voiceId ? "id" : "text",
                ...(voiceId ? { voice_id: voiceId } : {}),
                input_text: script,
              },
              background: {
                type: "color",
                value: "#ffffff",
              },
            },
          ],
          dimension: {
            width: 1080,
            height: 1920,
          },
          aspect_ratio: "9:16",
        };

        const generateResponse = await fetch("https://api.heygen.com/v2/video/generate", {
          method: "POST",
          headers: {
            "X-Api-Key": HEYGEN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoPayload),
        });

        const generateResult = await generateResponse.json();
        console.log("Video generation result:", generateResult);

        if (!generateResponse.ok) {
          return new Response(
            JSON.stringify({ error: generateResult.message || "Failed to generate video", details: generateResult }),
            { status: generateResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify(generateResult),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "check_video_status": {
        // Check video generation status
        const { videoId } = data;
        
        if (!videoId) {
          return new Response(
            JSON.stringify({ error: "videoId is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Checking video status: ${videoId}`);

        const statusResponse = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
          method: "GET",
          headers: {
            "X-Api-Key": HEYGEN_API_KEY,
            "Content-Type": "application/json",
          },
        });

        const statusResult = await statusResponse.json();
        console.log("Video status:", statusResult);

        return new Response(
          JSON.stringify(statusResult),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("HeyGen function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});