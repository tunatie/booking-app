import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getNextPage, getPreviousPage } from "../utils/pageOrder";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import HeaderActions from "../components/HeaderActions";

export default function PhotosPage() {
    const navigate = useNavigate();
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showMenu, setShowMenu] = useState(null);

    // Load existing photos when component mounts
    useEffect(() => {
        setLoading(true);
        axios.get('/places-form-data').then(({data}) => {
            if (data?.photos) {
                setAddedPhotos(data.photos);
            }
             setLoading(false);
        }).catch(err => {
            console.error("Error loading initial photos:", err);
            setLoading(false);
        });
    }, []);

    // Hàm helper để lưu ảnh lên server
    const savePhotosToServer = async (photosToSave) => {
        try {
            await axios.put('/places-form-data', { photos: photosToSave });
        } catch (error) {
            console.error('Error saving photos to server:', error);
            // Có thể thêm thông báo lỗi cho người dùng ở đây
        }
    };

    // Add click outside handler to close menu
    useEffect(() => {
        function handleClickOutside(e) {
            if (showMenu && !e.target.closest('.menu-container')) {
                setShowMenu(null);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMenu]);

    async function uploadPhoto(e) {
        const files = e.target.files;
        if (!files || files.length === 0) return; // Handle no files selected
        setLoading(true); // Bắt đầu loading
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        try {
            const { data: filenames } = await axios.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (filenames && filenames.length > 0) {
                 const newPhotos = [...addedPhotos, ...filenames];
                 setAddedPhotos(newPhotos);
                 await savePhotosToServer(newPhotos); // Lưu ngay
            } else {
                console.error('Upload completed but no filenames received.');
                // Handle error: show message to user?
            }
        } catch (err) {
             console.error('Error uploading photos:', err);
             // Handle error: show message to user?
        }
        setLoading(false); // Kết thúc loading
        setShowUploadModal(false);
    }

    function removePhoto(filename) {
        const newPhotos = addedPhotos.filter(photo => photo !== filename);
        setAddedPhotos(newPhotos);
        savePhotosToServer(newPhotos); // Lưu ngay (kể cả khi rỗng)
        setShowMenu(null); // Đóng menu sau khi xóa
    }

    function handleDragEnd(result) {
        if (!result.destination) return;
        
        const items = Array.from(addedPhotos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        setAddedPhotos(items);
        savePhotosToServer(items); // Lưu ngay
    }

    function movePhotoToFront(index) {
        const items = Array.from(addedPhotos);
        const [movedItem] = items.splice(index, 1);
        items.unshift(movedItem);
        setAddedPhotos(items);
        savePhotosToServer(items); // Lưu ngay
        setShowMenu(null);
    }

    function movePhotoToBack(index) {
        const items = Array.from(addedPhotos);
        const [movedItem] = items.splice(index, 1);
        items.push(movedItem);
        setAddedPhotos(items);
        savePhotosToServer(items); // Lưu ngay
        setShowMenu(null);
    }

    function movePhotoForward(index) {
        if (index <= 0) return; 
        const items = Array.from(addedPhotos);
        const temp = items[index - 1];
        items[index - 1] = items[index];
        items[index] = temp;
        setAddedPhotos(items);
        savePhotosToServer(items); // Lưu ngay
        setShowMenu(null);
    }

    function movePhotoBackward(index) {
        if (index >= addedPhotos.length - 1) return; 
        const items = Array.from(addedPhotos);
        const temp = items[index + 1];
        items[index + 1] = items[index];
        items[index] = temp;
        setAddedPhotos(items);
        savePhotosToServer(items); // Lưu ngay
        setShowMenu(null);
    }

    function handleNext() {
        const nextPage = getNextPage('photos');
        if (nextPage) {
            navigate(`/account/hosting/${nextPage}`);
        }
    }

    function handleBack() {
        const prevPage = getPreviousPage('photos');
        if (prevPage) {
            navigate(`/account/hosting/${prevPage}`);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <HeaderActions />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                    <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                        <button 
                            onClick={handleBack}
                            className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                        >
                            Quay lại
                        </button>
                        <button 
                            className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                            disabled
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderActions />
            
            <div className="flex-1 pt-[48px] pb-[88px]">
                <div className="w-full max-w-[1280px] mx-auto px-20 text-center">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-[32px] font-semibold">
                            Bổ sung một số bức ảnh chụp chỗ ở thuộc danh mục nhà của bạn
                        </h1>
                        {addedPhotos.length > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm('Bạn có chắc muốn xóa tất cả ảnh?')) {
                                        setAddedPhotos([]);
                                    }
                                }}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Xóa tất cả ảnh
                            </button>
                        )}
                    </div>
                    <p className="text-gray-500 text-lg mb-12">
                        Bạn sẽ cần 5 bức ảnh để bắt đầu. Về sau, bạn vẫn có thể đăng thêm hoặc thay đổi ảnh.
                    </p>

                    <div className="flex flex-col items-center">
                        {addedPhotos.length > 0 ? (
                            <div className="w-full">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold">Chọn ít nhất 5 bức ảnh</h2>
                                    <p className="text-gray-500 mt-1">Kéo để sắp xếp lại</p>
                                </div>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="photos" direction="horizontal">
                                        {(provided) => (
                                            <div 
                                                className="grid gap-2 mb-8"
                                                style={{
                                                    gridTemplateColumns: "repeat(4, 1fr)",
                                                    gridAutoRows: "300px",
                                                    gridAutoFlow: "dense"
                                                }}
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {addedPhotos.map((link, index) => (
                                                    <Draggable key={link} draggableId={link} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`relative cursor-move group ${
                                                                    index === 0 ? 'col-span-2 row-span-2' : ''
                                                                } ${snapshot.isDragging ? 'z-50' : ''}`}
                                                            >
                                                                <img
                                                                    src={'http://localhost:4000/uploads/' + link}
                                                                    alt=""
                                                                    className="rounded-xl w-full h-full object-cover"
                                                                />
                                                                {/* Three dots menu button */}
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShowMenu(index === showMenu ? null : index);
                                                                    }}
                                                                    className="absolute top-3 right-3 bg-white p-1.5 rounded-full hover:bg-gray-100 menu-container opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                                    </svg>
                                                                </button>
                                                                
                                                                {/* Dropdown Menu */}
                                                                {showMenu === index && (
                                                                    <div className="absolute top-12 right-3 bg-white rounded-xl shadow-lg py-2 w-48 z-50 menu-container">
                                                                        <button 
                                                                            className="w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-100"
                                                                        >
                                                                            Chỉnh sửa
                                                                        </button>
                                                                        {index !== 0 && (
                                                                            <>
                                                                                <button 
                                                                                    onClick={() => movePhotoToFront(index)}
                                                                                    className="w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-100"
                                                                                >
                                                                                    Đặt làm ảnh bìa
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => movePhotoBackward(index)}
                                                                                    className="w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-100"
                                                                                >
                                                                                    Di chuyển về phía sau
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => movePhotoForward(index)}
                                                                                    className="w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-100"
                                                                                >
                                                                                    Di chuyển về phía trước
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                        <button 
                                                                            onClick={() => {
                                                                                removePhoto(link);
                                                                                setShowMenu(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-100"
                                                                        >
                                                                            Xóa
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Cover photo badge */}
                                                                {index === 0 && (
                                                                    <div className="absolute top-3 left-3 bg-white rounded-md px-2 py-1">
                                                                        <span className="text-sm">Ảnh bìa</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                <button 
                                                    onClick={() => setShowUploadModal(true)}
                                                    className="aspect-square bg-white border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-600">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Thêm ảnh</span>
                                                </button>
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        ) : (
                            <div className="w-full max-w-2xl aspect-[4/3] mb-8">
                                <button 
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-2xl bg-white cursor-pointer hover:border-gray-400 transition-colors"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth="1.5" 
                                        stroke="currentColor" 
                                        className="w-20 h-20 mb-4 text-gray-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                    </svg>
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-lg font-medium">Thêm ảnh</span>
                                        <span className="text-gray-500">hoặc kéo và thả</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-[1280px] mx-auto px-20 py-6 flex justify-between">
                    <button 
                        onClick={handleBack}
                        className="bg-white px-6 py-3 rounded-lg hover:bg-gray-100 border border-black font-medium"
                    >
                        Quay lại
                    </button>
                    <button 
                        onClick={handleNext}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${addedPhotos.length >= 5 ? 'bg-black text-white hover:bg-[#222222]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={addedPhotos.length < 5 || loading}
                    >
                        Tiếp theo
                    </button>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-[568px]">
                        {/* Modal Header */}
                        <div className="flex items-center h-16 px-6 border-b border-gray-200">
                            <button 
                                onClick={() => setShowUploadModal(false)}
                                className="absolute bg-white hover:bg-gray-100 rounded-full p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h3 className="flex-1 text-center text-base">Tải ảnh lên</h3>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-600">Chưa có mục nào được chọn</p>
                            </div>

                            <div className="border border-dashed border-gray-300 rounded-lg p-12">
                                <div className="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-400 mb-4">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                    <p className="text-base mb-1">Kéo và thả</p>
                                    <p className="text-gray-400 text-sm mb-4">hoặc</p>
                                    <label className="cursor-pointer">
                                        <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                                        <span className="bg-white text-black border border-black text-sm px-4 py-2 rounded-lg hover:bg-gray-100">
                                            Duyệt tìm
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-between items-center h-16 px-6 border-t border-gray-200">
                            <button 
                                onClick={() => setShowUploadModal(false)}
                                className="text-black text-sm bg-white hover:bg-gray-100 px-4 py-2 rounded-md"
                            >
                                Hoàn tất
                            </button>
                            <button disabled className="text-sm bg-white text-[#DDDDDD] px-4 py-2 rounded-md border border-gray-200">
                                Tải lên
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 