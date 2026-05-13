export default function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(200).json({
    ok: true,
    service: "dignidade360",
    environment: "validation-ready",
    message: "Backend health endpoint preparado para Vercel. Autenticação e banco real devem ser conectados antes de dados clínicos reais.",
  });
}
