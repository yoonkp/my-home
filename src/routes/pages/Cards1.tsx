import { motion } from "framer-motion";

interface CardsProps {
  selectedCard: number | null;
  setSelectedCard: (index: number | null) => void;
}

const cardData = [
  { id: 0, label: "Card 1 (HYBE IM)" }, // 앞면
  { id: 2, label: "Card 2 (K Car)" }, // 오른쪽
  { id: 4, label: "Card 3 (Shinsegae TV Shopping)" }, // 윗면
];

const Cards1 = ({ selectedCard, setSelectedCard }: CardsProps) => {
  return (
    <div className="card-container">
      {cardData.map((card) => (
        <motion.div
          key={card.id}
          className={`card ${selectedCard === card.id ? "active" : ""}`}
          onClick={() => setSelectedCard(card.id)}
          animate={{
            scale: selectedCard === card.id ? 1.5 : 1,
            opacity: selectedCard === card.id ? 1 : 0.6,
            zIndex: selectedCard === card.id ? 10 : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          {card.label}
        </motion.div>
      ))}
    </div>
  );
};

export default Cards1;
