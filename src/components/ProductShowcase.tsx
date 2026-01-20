import { motion } from "framer-motion";
import { Sparkles, Upload, Image as ImageIcon, Camera } from "lucide-react";

// Import showcase images
import productDominos from "@/assets/showcase/product-dominos.png";
import productCocacola from "@/assets/showcase/product-cocacola.png";
import productSunshine from "@/assets/showcase/product-sunshine.png";
import productNike from "@/assets/showcase/product-nike.png";
import productFashion from "@/assets/showcase/product-fashion.png";
import productMcdonalds from "@/assets/showcase/product-mcdonalds.png";
import productPepsi from "@/assets/showcase/product-pepsi.png";
import productMegamare from "@/assets/showcase/product-megamare.png";

const showcaseItems = [
  { id: 1, image: productDominos, brand: "Domino's", category: "Food & Beverage" },
  { id: 2, image: productCocacola, brand: "Coca-Cola", category: "Beverages" },
  { id: 3, image: productSunshine, brand: "Sunshine", category: "Healthy Drinks" },
  { id: 4, image: productNike, brand: "Nike", category: "Fashion & Sports" },
  { id: 5, image: productFashion, brand: "Fashion", category: "Luxury" },
  { id: 6, image: productMcdonalds, brand: "McDonald's", category: "Fast Food" },
  { id: 7, image: productPepsi, brand: "Pepsi", category: "Beverages" },
  { id: 8, image: productMegamare, brand: "Megamare", category: "Perfumery" },
];

export const ProductShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Produtos Gerados por IA</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Galeria de
            </span>{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
              Produtos
            </span>
          </h2>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Adicione sua logomarca e veja a magia acontecer. Nossa IA cria imagens profissionais 
            para sua marca em segundos.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
            >
              <img
                src={item.image}
                alt={`${item.brand} - Produto gerado por IA`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-lg">{item.brand}</p>
                  <p className="text-white/70 text-sm">{item.category}</p>
                </div>
              </div>
              
              {/* Sparkle effect */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12"
        >
          <div className="flex items-center gap-8 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Sua Logo</span>
            </div>
            
            <div className="text-2xl text-muted-foreground">+</div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-cyan-500" />
              </div>
              <span className="text-sm text-muted-foreground">Seu Produto</span>
            </div>
            
            <div className="text-2xl text-muted-foreground">=</div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Foto Pro</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
