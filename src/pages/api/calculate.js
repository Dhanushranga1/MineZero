export default function handler(req, res) {
    if (req.method === 'POST') {
      const { excavation, transportation, equipment } = req.body;
      // Perform calculations here
      const totalEmissions = parseFloat(excavation) + parseFloat(transportation) + parseFloat(equipment);
      res.status(200).json({ totalEmissions });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  