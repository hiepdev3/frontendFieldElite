import { motion } from "framer-motion";

export default function WavesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top wave */}
      <motion.div
        className="absolute top-0 left-0 w-full h-64 opacity-20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full fill-blue-400"
          preserveAspectRatio="none"
        >
          <path d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,165.3C672,192,768,224,864,213.3C960,203,1056,149,1152,117.3C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </motion.div>

      {/* Middle wave */}
      <motion.div
        className="absolute top-1/4 left-0 w-full h-64 opacity-15"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
      >
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full fill-cyan-400"
          preserveAspectRatio="none"
        >
          <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,144C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </motion.div>

      {/* Bottom wave */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-64 opacity-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
      >
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full fill-blue-500"
          preserveAspectRatio="none"
        >
          <path d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>

      {/* Floating circles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-300 opacity-20"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 10 + 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}