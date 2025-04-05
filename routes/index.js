//Definicion de router general
import express from "express";
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("Conexion desde el router general ");
});

export default router;
