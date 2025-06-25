import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const SplashScreen = () => {
    const navigate = useNavigate();
    const title = "Sorting Visualizer".split("");

    const handleStart = () => {
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white font-[Poppins] relative overflow-hidden">
            {/* Floating Bars Animation */}
            <div className="absolute inset-0 z-0 flex items-end justify-center gap-1 px-10">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 rounded bg-white/20"
                        initial={{ height: Math.random() * 80 + 20 }}
                        animate={{ height: [20, 100, 30, 80, 40][i % 5] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", delay: i * 0.1 }}
                    />
                ))}
            </div>

            <motion.div
                className="text-5xl md:text-7xl font-bold mb-6 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {title.map((char, index) => (
                    <motion.span
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="inline-block"
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>

            <motion.p
                className="text-lg md:text-2xl mb-12 z-10 text-center max-w-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
            >
                Explore the fascinating world of sorting algorithms through stunning visual animations.
            </motion.p>

            <motion.button
                onClick={handleStart}
                className="mt-6 px-8 py-3 bg-white text-purple-700 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                Get Started
            </motion.button>
        </div>
    );
};

export default SplashScreen;
