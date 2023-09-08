import { Outlet } from "react-router-dom"
import { Container } from "react-bootstrap";

export function PlanLayout() {
  return (
    <Container>
      <h1
        className="text-center border rounded p-3"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        Plan
      </h1>

      <Outlet />
      
    </Container>
  )
}

export default PlanLayout;