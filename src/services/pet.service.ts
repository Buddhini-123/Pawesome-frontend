import { api, host } from './api';
import { Pet } from '../types';

export interface BackendPet {
  id: number;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'other';
  breed?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  weight?: number;
  weight_unit?: 'kg' | 'lbs';
  color?: string;
  is_neutered?: boolean;
  microchip_id?: string;
  image_url?: string;
  medical_notes?: string;
  allergies?: string[];
  medications?: string[];
  is_active?: boolean;
  age?: string; // Backend calculated age (e.g., "3 years, 8 months")
  created_at?: string;
  updated_at?: string;
}

export interface PetFilters {
  species?: string;
  status?: 'active' | 'inactive';
}

class PetService {
  /**
   * Get list of user's pets
   */
  async getPets(filters?: PetFilters): Promise<BackendPet[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.species) params.append('species', filters.species);
      if (filters?.status) params.append('status', filters.status);

      const queryString = params.toString();
      const endpoint = queryString ? `/pets?${queryString}` : '/pets';

      const response = await api.get<BackendPet[]>(endpoint);
      console.log('[PetService] Fetched pets:', response);

      if (response.success && response.data) {
        // Handle double-wrapped response
        let petsData = response.data;
        if ((petsData as any).data && Array.isArray((petsData as any).data)) {
          petsData = (petsData as any).data;
        }
        return Array.isArray(petsData) ? petsData : [];
      }
      return [];
    } catch (error: any) {
      console.error('[PetService] Failed to fetch pets:', error);
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Get single pet by ID
   */
  async getPet(id: string | number): Promise<BackendPet | null> {
    try {
      const response = await api.get<BackendPet>(`/pets/${id}`);

      if (response.success && response.data) {
        let petData = response.data;
        if ((petData as any).data && typeof (petData as any).data === 'object') {
          petData = (petData as any).data;
        }
        return petData as BackendPet;
      }
      return null;
    } catch (error: any) {
      console.error('[PetService] Failed to fetch pet:', error);
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get pets by species
   */
  async getPetsBySpecies(species: string): Promise<BackendPet[]> {
    try {
      const response = await api.get<BackendPet[]>(`/pets/species/${species}`);

      if (response.success && response.data) {
        let petsData = response.data;
        if ((petsData as any).data && Array.isArray((petsData as any).data)) {
          petsData = (petsData as any).data;
        }
        return Array.isArray(petsData) ? petsData : [];
      }
      return [];
    } catch (error: any) {
      console.error('[PetService] Failed to fetch pets by species:', error);
      return [];
    }
  }

  /**
   * Add new pet (supports image upload)
   */
  async addPet(petData: {
    name: string;
    species: string;
    breed?: string;
    date_of_birth?: string;
    gender?: string;
    weight?: number;
    weight_unit?: string;
    color?: string;
    is_neutered?: boolean;
    microchip_id?: string;
    medical_notes?: string;
    allergies?: string[];
    medications?: string[];
    image?: File;
  }): Promise<BackendPet> {
    try {
      const formData = new FormData();

      // Add all pet data to FormData
      formData.append('name', petData.name);
      formData.append('species', petData.species);

      if (petData.breed) formData.append('breed', petData.breed);
      if (petData.date_of_birth) formData.append('date_of_birth', petData.date_of_birth);
      if (petData.gender) formData.append('gender', petData.gender);
      if (petData.weight !== undefined) formData.append('weight', petData.weight.toString());
      if (petData.weight_unit) formData.append('weight_unit', petData.weight_unit);
      if (petData.color) formData.append('color', petData.color);
      if (petData.is_neutered !== undefined) formData.append('is_neutered', petData.is_neutered ? '1' : '0');
      if (petData.microchip_id) formData.append('microchip_id', petData.microchip_id);
      if (petData.medical_notes) formData.append('medical_notes', petData.medical_notes);

      // Handle arrays
      if (petData.allergies && petData.allergies.length > 0) {
        petData.allergies.forEach(allergy => {
          formData.append('allergies[]', allergy);
        });
      }

      if (petData.medications && petData.medications.length > 0) {
        petData.medications.forEach(medication => {
          formData.append('medications[]', medication);
        });
      }

      // Add image if provided
      if (petData.image) {
        formData.append('image', petData.image);
      }

      console.log('[PetService] Adding pet with FormData:', {
        name: petData.name,
        species: petData.species,
        hasImage: !!petData.image
      });

      // Use fetch directly for multipart/form-data
      const token = localStorage.getItem('auth_token');
      console.log('[PetService] Token:', token ? 'Present' : 'Missing');
      console.log('[PetService] URL:', `${host}/api/pets`);

      const response = await fetch(`${host}/api/pets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      console.log('[PetService] Response status:', response.status);
      console.log('[PetService] Response headers:', response.headers.get('content-type'));

      // Get response text first to handle non-JSON responses
      const responseText = await response.text();
      console.log('[PetService] Response text (first 500 chars):', responseText.substring(0, 500));

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[PetService] Failed to parse response as JSON');
        throw new Error(`Server returned non-JSON response (${response.status}): ${responseText.substring(0, 200)}`);
      }

      console.log('[PetService] Add pet response:', result);

      if (!response.ok) {
        throw new Error(result.message || `Failed to add pet (${response.status})`);
      }

      // Extract pet data from response
      let petResponse = result.data;
      if (result.data?.data) {
        petResponse = result.data.data;
      }

      return petResponse;
    } catch (error: any) {
      console.error('[PetService] Failed to add pet:', error);
      throw error;
    }
  }

  /**
   * Update pet (POST for images, PUT for data only)
   */
  async updatePet(
    id: string | number,
    petData: {
      name?: string;
      species?: string;
      breed?: string;
      date_of_birth?: string;
      gender?: string;
      weight?: number;
      weight_unit?: string;
      color?: string;
      is_neutered?: boolean;
      microchip_id?: string;
      medical_notes?: string;
      allergies?: string[];
      medications?: string[];
      image?: File;
    }
  ): Promise<BackendPet> {
    try {
      // If image is provided, use POST with FormData
      if (petData.image) {
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Laravel method spoofing

        // Add all pet data to FormData
        if (petData.name) formData.append('name', petData.name);
        if (petData.species) formData.append('species', petData.species);
        if (petData.breed) formData.append('breed', petData.breed);
        if (petData.date_of_birth) formData.append('date_of_birth', petData.date_of_birth);
        if (petData.gender) formData.append('gender', petData.gender);
        if (petData.weight !== undefined) formData.append('weight', petData.weight.toString());
        if (petData.weight_unit) formData.append('weight_unit', petData.weight_unit);
        if (petData.color) formData.append('color', petData.color);
        if (petData.is_neutered !== undefined) formData.append('is_neutered', petData.is_neutered ? '1' : '0');
        if (petData.microchip_id) formData.append('microchip_id', petData.microchip_id);
        if (petData.medical_notes) formData.append('medical_notes', petData.medical_notes);

        // Handle arrays
        if (petData.allergies && petData.allergies.length > 0) {
          petData.allergies.forEach(allergy => {
            formData.append('allergies[]', allergy);
          });
        }

        if (petData.medications && petData.medications.length > 0) {
          petData.medications.forEach(medication => {
            formData.append('medications[]', medication);
          });
        }

        formData.append('image', petData.image);

        console.log('[PetService] Updating pet with image using POST');

        const token = localStorage.getItem('auth_token');
        console.log('[PetService] Token:', token ? 'Present' : 'Missing');
        console.log('[PetService] Update URL:', `${host}/api/pets/${id}`);

        const response = await fetch(`${host}/api/pets/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formData
        });

        console.log('[PetService] Update response status:', response.status);

        // Get response text first to handle non-JSON responses
        const responseText = await response.text();
        console.log('[PetService] Update response (first 500 chars):', responseText.substring(0, 500));

        // Try to parse as JSON
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('[PetService] Failed to parse update response as JSON');
          throw new Error(`Server returned non-JSON response (${response.status}): ${responseText.substring(0, 200)}`);
        }

        if (!response.ok) {
          throw new Error(result.message || `Failed to update pet (${response.status})`);
        }

        let petResponse = result.data;
        if (result.data?.data) {
          petResponse = result.data.data;
        }

        return petResponse;
      } else {
        // Use PUT for data-only updates
        console.log('[PetService] Updating pet data using PUT');

        const response = await api.put<BackendPet>(`/pets/${id}`, petData);

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to update pet');
        }

        let petResponse = response.data;
        if ((petResponse as any).data) {
          petResponse = (petResponse as any).data;
        }

        return petResponse as BackendPet;
      }
    } catch (error: any) {
      console.error('[PetService] Failed to update pet:', error);
      throw error;
    }
  }

  /**
   * Delete pet
   */
  async deletePet(id: string | number): Promise<void> {
    try {
      const response = await api.delete(`/pets/${id}`);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete pet');
      }

      console.log('[PetService] Pet deleted successfully');
    } catch (error: any) {
      console.error('[PetService] Failed to delete pet:', error);
      throw error;
    }
  }

  /**
   * Toggle pet active status
   */
  async toggleActive(id: string | number): Promise<BackendPet> {
    try {
      const response = await api.patch<BackendPet>(`/pets/${id}/toggle-active`);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to toggle pet status');
      }

      let petResponse = response.data;
      if ((petResponse as any).data) {
        petResponse = (petResponse as any).data;
      }

      console.log('[PetService] Pet status toggled:', petResponse);
      return petResponse as BackendPet;
    } catch (error: any) {
      console.error('[PetService] Failed to toggle pet status:', error);
      throw error;
    }
  }

  /**
   * Convert backend pet format to frontend Pet type
   */
  convertToFrontendPet(backendPet: BackendPet): Pet {
    // Normalize image URL
    let imageUrl = backendPet.image_url || '';
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${host}${imageUrl}`;
    }

    return {
      id: String(backendPet.id),
      name: backendPet.name,
      type: backendPet.species as any,
      breed: backendPet.breed,
      gender: backendPet.gender,
      weight: backendPet.weight,
      weightUnit: backendPet.weight_unit,
      color: backendPet.color,
      isNeutered: backendPet.is_neutered,
      microchipId: backendPet.microchip_id,
      image: imageUrl,
      medicalNotes: backendPet.medical_notes,
      allergies: backendPet.allergies || [],
      medications: backendPet.medications || [],
      dateOfBirth: backendPet.date_of_birth ? new Date(backendPet.date_of_birth) : undefined,
      timeline: [], // Initialize empty timeline (timeline feature to be implemented later)
      createdAt: backendPet.created_at ? new Date(backendPet.created_at) : new Date(),
      updatedAt: backendPet.updated_at ? new Date(backendPet.updated_at) : new Date(),
    };
  }

  /**
   * Convert frontend Pet type to backend format
   */
  convertToBackendFormat(pet: Partial<Pet>): any {
    const backendData: any = {};

    if (pet.name) backendData.name = pet.name;
    if (pet.type) backendData.species = pet.type;
    if (pet.breed) backendData.breed = pet.breed;
    if (pet.gender) backendData.gender = pet.gender;
    if (pet.weight !== undefined) backendData.weight = pet.weight;
    if (pet.weightUnit) backendData.weight_unit = pet.weightUnit;
    if (pet.color) backendData.color = pet.color;
    if (pet.isNeutered !== undefined) backendData.is_neutered = pet.isNeutered;
    if (pet.microchipId) backendData.microchip_id = pet.microchipId;
    if (pet.medicalNotes) backendData.medical_notes = pet.medicalNotes;
    if (pet.allergies) backendData.allergies = pet.allergies;
    if (pet.medications) backendData.medications = pet.medications;
    if (pet.dateOfBirth) {
      const date = new Date(pet.dateOfBirth);
      backendData.date_of_birth = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    return backendData;
  }
}

export const petService = new PetService();
