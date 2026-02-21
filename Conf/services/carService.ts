import type { ApiResponse } from "../../types/ApiResponse";
import type { Carro } from "../../types/carro";

const api_url = "http://192.168.1.103:8080";

if (!api_url) {
  throw new Error("BACKEND_URL is not defined");
}

export async function getCars(): Promise<ApiResponse<Carro[]>> {
  try {
    const response = await fetch(`${api_url}/car`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error fetching cars");
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCarById(
  id: number
): Promise<ApiResponse<Carro>> {
  try {
    const response = await fetch(`${api_url}/car/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error fetching car with id ${id}`);
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCar(
  carro: Carro
): Promise<ApiResponse<Carro>> {
  try {
    const response = await fetch(`${api_url}/car`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carro),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Error creating car");
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCar(
  id: number,
  carro: Partial<Carro>
): Promise<ApiResponse<Carro>> {
  try {
    const response = await fetch(`${api_url}/car/${id}`, {
      method: "PUT", // ou PATCH dependendo do backend
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carro),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error updating car");
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCar(
  id: number
): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${api_url}/car/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Error deleting car");
    }

    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}