import { motion } from "framer-motion";

interface CardsProps {
  selectedCard: number | null;
}

const cardData = ["Card 1", "Card 2", "Card 3", "Card 4"];

const Cards = ({ selectedCard }: CardsProps) => {
  return (
    <div className="card-container">
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          className={`card ${selectedCard === index ? "active" : ""}`}
          animate={{
            scale: selectedCard === index ? 1.5 : 1,
            opacity: selectedCard === index ? 1 : 0.6,
            zIndex: selectedCard === index ? 10 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  );
};

export default Cards;
