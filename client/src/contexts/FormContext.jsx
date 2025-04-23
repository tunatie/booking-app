import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const FormContext = createContext();

export function useForm() {
    return useContext(FormContext);
}

const initialFormData = {
    // Thông tin cơ bản
    placeType: '',
    propertyType: '',
    privacyType: '',
    location: {
        country: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
    },
    address: '',
    // Thông tin chi tiết
    floorPlan: {
        guests: 1,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1
    },
    amenities: [],
    photos: [],
    title: '',
    description: '',
    standOut: [],
    // Thông tin đặt phòng
    guestType: '',
    price: '',
    discounts: {
        weekly: 0,
        monthly: 0
    },
    security: {
        hasCamera: false,
        hasNoiseDetector: false,
        hasWeapon: false
    }
};

export function FormProvider({ children }) {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    const loadFormData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setFormData(initialFormData);
                return;
            }
            
            setLoading(true);
            const response = await axios.get('/places-form-data');
            if (response.data) {
                setFormData(response.data);
                setInitialized(true);
            } else {
                setFormData(initialFormData);
            }
        } catch (error) {
            console.error('Error loading form data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
            }
            setFormData(initialFormData);
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = async (section, data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
            }

            setError(null);
            setLoading(true);
            
            // Update local state first
            setFormData(prev => {
                const newData = typeof data === 'function' ? data(prev[section]) : data;
                return {
                    ...prev,
                    [section]: newData
                };
            });

            // Then sync with server - only send the updated section
            const updatePayload = {
                [section]: data
            };
            
            await axios.put('/places-form-data', updatePayload);
        } catch (err) {
            console.error('Error updating form data:', err);
            setError(err.message);
            // Revert local state on error
            loadFormData();
        } finally {
            setLoading(false);
        }
    };

    const resetForm = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setFormData(initialFormData);
                return;
            }

            setLoading(true);
            await axios.delete('/places-form-data');
            setFormData(initialFormData);
        } catch (err) {
            console.error('Error resetting form:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContext.Provider value={{ 
            formData, 
            updateFormData, 
            resetForm,
            loading,
            error,
            loadFormData,
            initialized
        }}>
            {children}
        </FormContext.Provider>
    );
}