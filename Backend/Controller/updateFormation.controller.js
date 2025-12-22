import { db } from "../db.js";

export const updateFormation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      axe,
      type,
      intitule,
      population,
      niveau,
      prerequis,
      Duree,
      id_formateur,
      interne_externe,
      parcours
    } = req.body;

    // Update the formation
    const [result] = await db.query(
      `UPDATE formation
       SET axe = ?, type = ?, intitule = ?, population = ?, niveau = ?, prerequis = ?, Duree = ?, id_formateur = ?, interne_externe = ?,parcours = ?
       WHERE id_formation = ?`,
      [axe, type, intitule, population, niveau, prerequis, Duree, id_formateur, interne_externe,parcours, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Formation not found" });
    }

    res.json({ message: "Formation updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
