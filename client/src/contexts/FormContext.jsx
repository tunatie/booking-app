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
<<<<<<< HEAD
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
=======
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
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = async (section, data) => {
        try {
<<<<<<< HEAD
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
            }

            setError(null);
            setLoading(true);
=======
            setError(null);
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
            
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
            
<<<<<<< HEAD
=======
            console.log('Updating form data:', section, updatePayload);
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
            await axios.put('/places-form-data', updatePayload);
        } catch (err) {
            console.error('Error updating form data:', err);
            setError(err.message);
            // Revert local state on error
            loadFormData();
<<<<<<< HEAD
        } finally {
            setLoading(false);
=======
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        }
    };

    const resetForm = async () => {
        try {
<<<<<<< HEAD
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

=======
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

>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
    return (
        <FormContext.Provider value={{ 
            formData, 
            updateFormData, 
            resetForm,
            loading,
            error,
<<<<<<< HEAD
            loadFormData,
            initialized
=======
            loadFormData 
>>>>>>> 12d658f551c09d2071399818f257e90056fa6fbd
        }}>
            {children}
        </FormContext.Provider>
    );
}