export const Manifesto = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-black">
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <blockquote className="text-center space-y-8">
          <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed animate-breathe">
            Em 2067, tecnologia sem{" "}
            <span className="text-primary font-normal animate-pulse">emoção</span>{" "}
            é ruído.
          </p>
          
          <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed animate-breathe" style={{ animationDelay: '1s' }}>
            Nós criamos{" "}
            <span className="text-secondary font-normal">silêncio</span>,{" "}
            beleza e conexão.
          </p>
          
          <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed animate-breathe" style={{ animationDelay: '2s' }}>
            Criamos o que o{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-normal">
              coração entende
            </span>{" "}
            antes da mente.
          </p>
        </blockquote>

        {/* Decorative Lines */}
        <div className="mt-16 flex justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
