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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);

    // Load initial data only once when provider mounts
    useEffect(() => {
        if (!initialized) {
            loadFormData();
            setInitialized(true);
        }
    }, [initialized]);

    const loadFormData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/places-form-data');
            console.log('Loaded form data:', response.data);
            
            // Only update if we have actual data
            if (response.data && Object.keys(response.data).length > 0) {
                setFormData(prevData => ({
                    ...prevData,
                    ...response.data
                }));
            }
        } catch (err) {
            console.error('Error loading form data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = async (section, data) => {
        try {
            setError(null);
            
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
            
            console.log('Updating form data:', section, updatePayload);
            await axios.put('/places-form-data', updatePayload);
        } catch (err) {
            console.error('Error updating form data:', err);
            setError(err.message);
            // Revert local state on error
            loadFormData();
        }
    };

    const resetForm = async () => {
        try {
            setFormData(initialFormData);
            await axios.delete('/places-form-data');
        } catch (err) {
            console.error('Error resetting form:', err);
            setError(err.message);
        }
    };

    // Debug log whenever formData changes
    useEffect(() => {
        console.log('Current form data:', formData);
    }, [formData]);

    return (
        <FormContext.Provider value={{ 
            formData, 
            updateFormData, 
            resetForm,
            loading,
            error,
            loadFormData 
        }}>
            {children}
        </FormContext.Provider>
    );
}