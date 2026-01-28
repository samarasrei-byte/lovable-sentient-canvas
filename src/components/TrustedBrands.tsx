import { motion } from "framer-motion";

export const TrustedBrands = () => {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center"
      >
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
          Confiado por
        </p>
        <h3 className="text-xl md:text-2xl font-light text-muted-foreground">
          Marcas que acreditam na{" "}
          <span className="text-foreground font-medium">nova economia criativa</span>
        </h3>
      </motion.div>
    </section>
  );
};
