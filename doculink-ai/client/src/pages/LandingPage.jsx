import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Search, Zap, Shield, ArrowRight, Github } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-8 flex flex-col items-center text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 -z-10 h-screen w-screen overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-teal/5 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/20 text-accent font-bold text-sm mb-8"
        >
          <Zap className="h-4 w-4" />
          <span>Next-Gen RAG Architecture</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-serif font-bold tracking-tight max-w-5xl mb-8 leading-[1.1]"
        >
          Talk to your documents with <span className="text-accent italic">intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-muted text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed"
        >
          DocuLink AI transforms static PDFs into interactive conversations. Instant answers, verified citations, and semantic search at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Button as={Link} to="/signup" className="h-14 px-10 text-lg">
            Start Building Free <ArrowRight className="h-5 w-5" />
          </Button>
          <Button variant="secondary" className="h-14 px-10 text-lg">
            View Live Demo
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-8 mt-40">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            variants={item}
            icon={Search} 
            title="Semantic Search" 
            desc="Go beyond keyword matching. Our vector-based search understands the intent behind your questions."
          />
          <FeatureCard 
            variants={item}
            icon={Shield} 
            title="Smart Citations" 
            desc="Every AI answer is backed by exact document chunks. Never guess where the information came from again."
          />
          <FeatureCard 
            variants={item}
            icon={Zap} 
            title="Instant Indexing" 
            desc="Upload massive PDFs and start chatting in seconds. Our parallel chunking engine handles the heavy lifting."
          />
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-8 mt-40">
        <Card className="relative overflow-hidden p-16 text-center border-accent/20 bg-accent/5">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to upgrade your workflow?</h2>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto">Join 5,000+ developers and companies building the future of intelligent document analysis.</p>
          <Button as={Link} to="/signup" className="h-14 px-12 text-lg mx-auto">Get Started Now</Button>
        </Card>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, variants }) => (
  <motion.div variants={variants}>
    <Card className="h-full hover:bg-accent/5 border-transparent hover:border-accent/20 group">
      <div className="h-14 w-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted leading-relaxed">{desc}</p>
    </Card>
  </motion.div>
);

export default LandingPage;
