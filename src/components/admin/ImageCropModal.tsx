import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Crop, 
  RotateCw, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Move
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageCropModal = ({
  open,
  onOpenChange,
  imageFile,
  onCropComplete,
}: ImageCropModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Load image when file changes
  useEffect(() => {
    if (open && imageFile) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
      img.src = URL.createObjectURL(imageFile);
      return () => URL.revokeObjectURL(img.src);
    }
  }, [open, imageFile]);

  // Measure container
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, [open, image]);

  // Draw preview
  useEffect(() => {
    if (!image || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cropSize = Math.min(containerSize.width, containerSize.height, 300);
    canvas.width = cropSize;
    canvas.height = cropSize;

    ctx.clearRect(0, 0, cropSize, cropSize);
    ctx.save();
    
    // Move to center
    ctx.translate(cropSize / 2, cropSize / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply zoom and position
    const scale = (cropSize / Math.max(image.width, image.height)) * zoom;
    
    ctx.drawImage(
      image,
      -image.width / 2 * scale + position.x,
      -image.height / 2 * scale + position.y,
      image.width * scale,
      image.height * scale
    );
    
    ctx.restore();
  }, [image, zoom, rotation, position, containerSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = (direction: "cw" | "ccw") => {
    setRotation((prev) => prev + (direction === "cw" ? 90 : -90));
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleCrop = useCallback(async () => {
    if (!image || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      // Create a new file with the cropped image
      const croppedFile = new File(
        [blob], 
        imageFile.name.replace(/\.[^.]+$/, '-cropped.jpg'),
        { type: 'image/jpeg' }
      );
      
      onCropComplete(croppedFile);
      onOpenChange(false);
    }, 'image/jpeg', 0.9);
  }, [image, imageFile, onCropComplete, onOpenChange]);

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5 text-primary" />
            Recortar Imagem
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Preview Area */}
          <div 
            ref={containerRef}
            className="relative flex items-center justify-center bg-muted/30 rounded-xl overflow-hidden min-h-[300px]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Crop overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/50" />
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white border-dashed rounded-lg shadow-lg"
                style={{
                  width: Math.min(containerSize.width - 32, 300),
                  height: Math.min(containerSize.height - 32, 300),
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                }}
              />
            </div>

            {/* Preview canvas */}
            <canvas
              ref={previewCanvasRef}
              className="rounded-lg"
              style={{
                width: Math.min(containerSize.width - 32, 300),
                height: Math.min(containerSize.height - 32, 300),
              }}
            />

            {/* Drag hint */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-white/70 bg-black/40 px-2 py-1 rounded">
              <Move className="w-3 h-3" />
              Arraste para posicionar
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm">
                  <ZoomIn className="h-4 w-4 text-primary" />
                  Zoom
                </Label>
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Rotation */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotate("ccw")}
                className="gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                -90°
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotate("cw")}
                className="gap-1"
              >
                <RotateCw className="h-4 w-4" />
                +90°
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-cyan-500"
              onClick={handleCrop}
            >
              <Check className="h-4 w-4" />
              Aplicar Recorte
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
