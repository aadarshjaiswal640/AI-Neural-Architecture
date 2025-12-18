import { FLOPsBoxplot } from "../FLOPsBoxplot";

export default function FLOPsBoxplotExample() {
  const mockData = {
    labels: ["CNN", "Transformer", "RNN", "ResNet", "BERT"],
    min: [12, 25, 18, 15, 30],
    max: [45, 75, 52, 48, 85],
    median: [28, 48, 35, 30, 55],
    q1: [20, 35, 25, 22, 40],
    q3: [38, 62, 45, 40, 70],
  };

  return (
    <div className="p-4">
      <FLOPsBoxplot data={mockData} />
    </div>
  );
}
