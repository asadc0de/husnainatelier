"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { Upload, Minus, Plus, ChevronLeft, ChevronRight, ZoomIn, Edit, Trash2, ArrowLeft, Loader2, Move, Crop } from 'lucide-react';
import Toast from '../components/Toast';

const Admin = () => {
    const { products, addProduct, updateProduct, deleteProduct, loading } = useProduct();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }

    // Unified Image State
    // Structure: { id: string, url: string, file: File | null, position: { x: 50, y: 50 } }
    const [productImages, setProductImages] = useState([
        { id: 'img-0', url: '', file: null, position: { x: 50, y: 50 } },
        { id: 'img-1', url: '', file: null, position: { x: 50, y: 50 } },
        { id: 'img-2', url: '', file: null, position: { x: 50, y: 50 } },
        { id: 'img-3', url: '', file: null, position: { x: 50, y: 50 } }
    ]);

    // Drag & Drop State
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Positioning State
    const [adjustingIndex, setAdjustingIndex] = useState(null); // Index of image being adjusted
    const isDraggingPosition = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    const initialFormState = {
        name: '',
        price: 'Rs. ',
        description: '',
        category: 'Bridal',
    };

    const [formData, setFormData] = useState(initialFormState);
    const categories = ['Bridal', 'Casual', 'Festive', 'Modern', 'Accessories'];

    // --- FORM HANDLERS ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'name') {
            newValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
        }

        if (name === 'price') {
            if (!value.startsWith('Rs. ')) {
                newValue = 'Rs. ' + value.replace(/^Rs\.\s?/, '');
            }
        }

        // Enforce first letter capital only for Description
        if (name === 'description' && value.length > 0) {
            newValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    // --- IMAGE HANDLERS ---

    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductImages(prev => {
                    const newImages = [...prev];
                    newImages[index] = {
                        ...newImages[index],
                        url: reader.result,
                        file: file,
                        position: { x: 50, y: 50 } // Reset position on new upload
                    };
                    return newImages;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index) => {
        setProductImages(prev => {
            const newImages = [...prev];
            newImages[index] = { ...newImages[index], url: '', file: null, position: { x: 50, y: 50 } };
            return newImages;
        });
    };

    // --- DRAG AND DROP HANDLERS (REORDERING) ---

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        // Required for Firefox
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setProductImages(prev => {
            const newImages = [...prev];
            const draggedItem = newImages[draggedIndex];
            newImages.splice(draggedIndex, 1);
            newImages.splice(index, 0, draggedItem);
            return newImages;
        });
        setDraggedIndex(null);
    };

    // --- POSITIONING HANDLERS (PANNING) ---

    const toggleAdjustMode = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        if (adjustingIndex === index) {
            setAdjustingIndex(null); // Exit adjust mode
        } else {
            setAdjustingIndex(index); // Enter adjust mode
        }
    };

    const handleMouseDown = (e, index) => {
        if (adjustingIndex !== index) return;
        isDraggingPosition.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e, index) => {
        if (!isDraggingPosition.current || adjustingIndex !== index) return;

        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;

        startPos.current = { x: e.clientX, y: e.clientY }; // Update start pos for next delta

        setProductImages(prev => {
            const newImages = [...prev];
            const img = newImages[index];

            // Sensitivity factor - smaller means finer control
            const sensitivity = 0.2;

            let newX = img.position.x - (dx * sensitivity);
            let newY = img.position.y - (dy * sensitivity);

            // Clamp between 0 and 100
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            newImages[index] = {
                ...img,
                position: { x: newX, y: newY }
            };
            return newImages;
        });
    };

    const handleMouseUp = () => {
        isDraggingPosition.current = false;
    };

    // Global mouse up to catch drags that leave the container
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);


    // --- CRUD ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation: Ensure at least one image (the main one at index 0)
        if (!formData.name || !formData.price || !productImages[0].url) {
            setToast({ message: "Please fill in Name, Price, and at least the Main Image.", type: 'error' });
            return;
        }

        setUploading(true);

        try {
            // Upload all new files
            const uploadedImages = await Promise.all(productImages.map(async (imgObj) => {
                if (imgObj.file) {
                    // Upload new file
                    const secureUrl = await uploadToCloudinary(imgObj.file);
                    return { ...imgObj, url: secureUrl, file: null }; // Clear file after upload
                }
                return imgObj; // Keep existing info
            }));

            // Structuring for database
            const mainImageObj = uploadedImages[0];
            const additionalImagesObjs = uploadedImages.slice(1);

            const finalProduct = {
                ...formData,
                image: mainImageObj.url,
                additionalImages: additionalImagesObjs.map(obj => obj.url),
                // NEW: Save positioning data
                imagePositions: {
                    main: mainImageObj.position,
                    additional: additionalImagesObjs.map(obj => obj.position)
                }
            };

            if (isEditing) {
                await updateProduct(editId, finalProduct);
                setToast({ message: 'Product updated successfully!', type: 'success' });
            } else {
                await addProduct(finalProduct);
                setToast({ message: 'Product added successfully!', type: 'success' });
            }

            handleBackClick(true); // Reset form without confirmation

        } catch (error) {
            console.error("Upload/Save error:", error);
            setToast({ message: "Failed to save product. " + error.message, type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleEditClick = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description || '',
            category: product.category,
        });

        // Hydrate images state
        const loadedImages = [];

        // 1. Main Image
        loadedImages.push({
            id: 'main-' + Date.now(),
            url: product.image,
            file: null,
            position: product.imagePositions?.main || { x: 50, y: 50 }
        });

        // 2. Additional Images
        const adds = product.additionalImages || ['', '', ''];
        adds.forEach((url, i) => {
            loadedImages.push({
                id: `add-${i}-` + Date.now(),
                url: url || '',
                file: null,
                position: product.imagePositions?.additional?.[i] || { x: 50, y: 50 }
            });
        });

        // Ensure we always have 4 slots (1 main + 3 additional)
        while (loadedImages.length < 4) {
            loadedImages.push({ id: `empty-${loadedImages.length}`, url: '', file: null, position: { x: 50, y: 50 } });
        }

        setProductImages(loadedImages.slice(0, 4)); // Force max 4 for now

        setEditId(product.id);
        setIsEditing(true);
        setView('form');
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleAddNewClick = () => {
        setFormData(initialFormState);
        setProductImages([
            { id: 'img-0', url: '', file: null, position: { x: 50, y: 50 } },
            { id: 'img-1', url: '', file: null, position: { x: 50, y: 50 } },
            { id: 'img-2', url: '', file: null, position: { x: 50, y: 50 } },
            { id: 'img-3', url: '', file: null, position: { x: 50, y: 50 } }
        ]);
        setIsEditing(false);
        setEditId(null);
        setView('form');
    };

    const handleBackClick = (force = false) => {
        // If force is true, skip confirmation. Otherwise check for unsaved changes.
        if (!force && view === 'form' && !window.confirm('Discard changes?')) return;

        setView('list');
        setFormData(initialFormState);
        setProductImages([
            { id: 'img-0', url: '', file: null, position: { x: 50, y: 50 } },
            { id: 'img-1', url: '', file: null, position: { x: 50, y: 50 } },
            { id: 'img-2', url: '', file: null, position: { x: 50, y: 50 } },
            { id: 'img-3', url: '', file: null, position: { x: 50, y: 50 } }
        ]);
        setIsEditing(false);
        setAdjustingIndex(null);
    };

    return (
        <div className="min-h-screen pt-32 pb-16 container mx-auto px-6 md:px-12 bg-[#FFF7E4]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                {view === 'list' ? (
                    <>
                        <h1 className="font-serif text-3xl md:text-4xl text-black">Product Inventory</h1>
                        <button
                            onClick={handleAddNewClick}
                            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} /> Add New Product
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors uppercase tracking-widest text-xs font-bold"
                        >
                            <ArrowLeft size={16} /> Back to List
                        </button>
                        <h1 className="font-serif text-3xl md:text-4xl text-black">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <div className="w-40"></div>
                    </>
                )}
            </div>

            {/* LIST VIEW */}
            {view === 'list' && (
                <div className="overflow-x-auto border border-gray-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={`skeleton-${index}`} className="border-b border-gray-100">
                                        <td className="p-2 pl-3"><div className="w-10 h-12 bg-gray-400 rounded-sm animate-pulse"></div></td>
                                        <td className="p-3"><div className="h-4 w-32 bg-gray-400 rounded animate-pulse"></div></td>
                                        <td className="p-3"><div className="h-3 w-20 bg-gray-400 rounded animate-pulse"></div></td>
                                        <td className="p-3"><div className="h-4 w-16 bg-gray-400 rounded animate-pulse"></div></td>
                                        <td className="p-3 text-right"><div className="flex justify-end gap-2"><div className="w-8 h-8 bg-gray-400 rounded animate-pulse"></div></div></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        <td className="p-2 pl-3">
                                            <div className="w-10 h-12 bg-gray-400 overflow-hidden rounded-sm relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    style={{ objectPosition: `${product.imagePositions?.main?.x || 50}% ${product.imagePositions?.main?.y || 50}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium text-sm text-gray-800">{product.name}</td>
                                        <td className="p-3 text-xs text-gray-500 uppercase tracking-widest">{product.category}</td>
                                        <td className="p-3 font-serif text-sm text-gray-800">{product.price}</td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(product); }} className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-400 rounded-md transition-all">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(product.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 font-serif italic text-sm">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORM VIEW */}
            {view === 'form' && (
                <div className="flex flex-col lg:flex-row gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* LEFT COLUMN: LIVE PREVIEW */}
                    <div className="w-full lg:w-1/2 border border-gray-200 p-4 bg-white shadow-sm relative sticky top-32 self-start">
                        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 uppercase tracking-widest pointer-events-none z-10">Live Preview</div>

                        {/* Main Image Preview */}
                        <div className="w-full">
                            <div className="h-[580px] w-full bg-gray-100 mb-[1px] overflow-hidden relative group">
                                {productImages[0]?.url ? (
                                    <img
                                        src={productImages[0].url}
                                        alt="Product Preview"
                                        className="h-full w-full object-cover transition-all duration-300"
                                        style={{
                                            objectPosition: `${productImages[0].position.x}% ${productImages[0].position.y}%`,
                                            transform: adjustingIndex === 0 ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 uppercase tracking-widest text-sm">Main Image</div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-[1px]">
                                {productImages.slice(0, 4).map((img, i) => (
                                    <div key={img.id} className={`aspect-square bg-gray-100 overflow-hidden border-b-2 ${i === 0 ? 'border-primary' : 'border-transparent'}`}>
                                        {img.url && (
                                            <img
                                                src={img.url}
                                                className="w-full h-full object-cover"
                                                alt={`thumb-${i}`}
                                                style={{ objectPosition: `${img.position.x}% ${img.position.y}%` }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Preview */}
                        <div className="mt-8 px-4">
                            <div className="flex justify-between items-start mb-8">
                                <h1 className="font-serif text-4xl md:text-5xl text-primary break-words max-w-[70%]">{formData.name || 'Name'}</h1>
                                <span className="font-serif text-2xl text-gray-500">{formData.price}</span>
                            </div>
                            <div className="border-t border-gray-100 py-6">
                                <h3 className="text-sm font-bold text-primary mb-4">Description</h3>
                                <p className="text-sm text-gray-500 font-sans leading-relaxed whitespace-pre-line first-letter:uppercase">{formData.description || '...'}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: EDITOR FORM */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
                            <h2 className="font-serif text-2xl mb-8">{isEditing ? 'Update Product' : 'Create Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block font-serif text-lg mb-2">Product Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none capitalize" required />
                                </div>
                                <div>
                                    <label className="block font-serif text-lg mb-2">Price *</label>
                                    <input type="text" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none" required />
                                </div>
                                <div>
                                    <label className="block font-serif text-lg mb-2">Category *</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none bg-white">
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-serif text-lg mb-2">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none resize-none"></textarea>
                                </div>

                                {/* DRAG AND DROP IMAGE REORDERING & UPLOAD */}
                                <div>
                                    <label className="block font-serif text-lg mb-4">Product Images (Drag to Reorder) *</label>

                                    <div className="grid grid-cols-3 gap-4 select-none">
                                        {productImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                draggable={!adjustingIndex} // Disable drag if adjusting
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDrop={(e) => handleDrop(e, index)}
                                                className={`
                                                    relative aspect-square border-2 border-dashed border-gray-300
                                                    transition-all duration-300 bg-gray-50 group
                                                    ${draggedIndex === index ? 'opacity-50 border-black' : ''}
                                                    ${adjustingIndex === index ? 'ring-2 ring-blue-500 z-10 scale-105 shadow-xl cursor-move' : 'hover:border-gray-400'}
                                                    ${index === 0 ? 'col-span-3 aspect-[21/9]' : ''}
                                                `}
                                                onMouseDown={(e) => adjustingIndex === index && handleMouseDown(e, index)}
                                                onMouseMove={(e) => adjustingIndex === index && handleMouseMove(e, index)}
                                            >
                                                {/* Image Content */}
                                                {image.url ? (
                                                    <div className="w-full h-full relative overflow-hidden">
                                                        <img
                                                            src={image.url}
                                                            alt="Preview"
                                                            className={`w-full h-full object-cover pointer-events-none transition-transform duration-200`}
                                                            style={{
                                                                objectPosition: `${image.position.x}% ${image.position.y}%`,
                                                                transform: adjustingIndex === index ? 'scale(1.2)' : 'scale(1)'
                                                            }}
                                                        />

                                                        {/* Tools Overlay */}
                                                        <div className={`absolute top-2 right-2 flex gap-2 z-30 ${adjustingIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                                            {/* Adjust Position Tool */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => toggleAdjustMode(e, index)}
                                                                className={`p-2 rounded-full shadow-sm text-white transition-colors ${adjustingIndex === index ? 'bg-blue-600' : 'bg-black/50 hover:bg-black'}`}
                                                                title="Adjust Position (Pan)"
                                                            >
                                                                {adjustingIndex === index ? <Crop size={16} /> : <Move size={16} />}
                                                            </button>

                                                            {/* Delete Tool (only if not adjusting) */}
                                                            {adjustingIndex !== index && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-sm"
                                                                    title="Remove Image"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Adjust Mode Hint */}
                                                        {adjustingIndex === index && (
                                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                <div className="bg-black/70 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                                                    Drag to Pan
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                                                        <Upload size={index === 0 ? 32 : 24} className="mb-2" />
                                                        <span className="text-xs font-bold uppercase tracking-widest text-center">
                                                            {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                                                        </span>
                                                        <span className="text-[10px] mt-1 text-gray-400">Drag to Order</span>
                                                    </div>
                                                )}

                                                {/* File Input (Hidden, covers area if no image or standard mode) */}
                                                {!adjustingIndex && (
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, index)}
                                                        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${image.url ? 'z-0' : 'z-20'}`}
                                                        title="Click to Upload"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
                                        * Drag boxes to reorder. Click <Move size={10} className="inline mx-1" /> to adjust crop.
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={handleBackClick} className="w-1/3 bg-white text-black border border-gray-300 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" disabled={uploading} className="w-2/3 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                                        {uploading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (isEditing ? 'Save Changes' : 'Publish Product')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
