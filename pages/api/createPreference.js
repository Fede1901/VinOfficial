import mercadopago from "mercadopago";


if (!process.env.MP_ACCESS_TOKEN) {
  console.error("Access Token de Mercado Pago no está definido.");
} else {
  console.log("Access Token:", process.env.MP_ACCESS_TOKEN);
}

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { carrito } = req.body;

      const items = carrito.map(item => ({
        title: item.nombre,
        unit_price: item.precio,
        quantity: item.cantidad,
      }));

      const preference = {
        items,
        back_urls: {
          success: "http://localhost:3000/success",
          failure: "http://localhost:3000/failure",
          pending: "http://localhost:3000/pending",
        },
        auto_return: "approved",
      };

      const response = await mercadopago.preferences.create(preference);

      
      if (!response.body || !response.body.id) {
        throw new Error("No se obtuvo un ID de preferencia en la respuesta.");
      }

      res.status(200).json({ preferenceId: response.body.id });
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      res.status(500).json({ error: `Error al crear la preferencia: ${error.message}` });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
