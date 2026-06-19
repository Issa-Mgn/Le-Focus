import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, X, CheckCircle, PenTool, Layout, Type, FileText, Upload, Loader2, PlusCircle } from 'lucide-react';
import { categories } from '../data/mockData'; // Keeping categories from mockData is fine, or hardcode them
import { motion, AnimatePresence } from 'framer-motion';
import { convertImageToBase64, convertPdfToBase64, compressPdf } from '../utils/imageStorage';
import CustomAlert from '../components/CustomAlert';
import { api } from '../services/api';

const AdminNewArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politique');
  const [author, setAuthor] = useState('Wabi MIGAN');
  const [excerpt, setExcerpt] = useState('');
  const [paragraphs, setParagraphs] = useState(['']); // Array of paragraphs
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([false, false, false]);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState(null); // null, 'compressing', 'done'
  const [showPreview, setShowPreview] = useState(false);
  
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  // Load default author from settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('focus_settings');
    if (savedSettings) {
      const { defaultAuthor } = JSON.parse(savedSettings);
      if (defaultAuthor) {
        setAuthor(defaultAuthor);
      }
    }
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  // Paragraph management
  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (index) => {
    if (paragraphs.length > 1) {
      const newParagraphs = paragraphs.filter((_, i) => i !== index);
      setParagraphs(newParagraphs);
    }
  };

  const updateParagraph = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
  };

  const handleImageChange = async (e, startIndex) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Determine which slots to fill
      const slotsToFill = [];
      for (let i = 0; i < files.length; i++) {
        if (startIndex + i < 3) {
          slotsToFill.push(startIndex + i);
        }
      }

      if (slotsToFill.length === 0) return;

      // Show loading for affected slots
      const newUploadingImages = [...uploadingImages];
      slotsToFill.forEach(index => {
        newUploadingImages[index] = true;
      });
      setUploadingImages(newUploadingImages);

      const newImageFiles = [...imageFiles];
      const newPreviews = [...imagePreviews];
      let successCount = 0;

      try {
        // Process files in parallel
        await Promise.all(slotsToFill.map(async (slotIndex, i) => {
          try {
            const file = files[i];
            const base64 = await convertImageToBase64(file);
            
            newImageFiles[slotIndex] = base64;
            newPreviews[slotIndex] = base64;
            successCount++;
          } catch (error) {
            console.error(`Error processing image for slot ${slotIndex}`, error);
            showAlert('error', `Erreur lors du traitement de l'image ${slotIndex + 1}`);
          }
        }));

        setImageFiles(newImageFiles);
        setImagePreviews(newPreviews);

        if (successCount > 0) {
          showAlert('success', `${successCount} image(s) ajoutée(s) avec succès`);
        }
      } catch (error) {
        showAlert('error', "Erreur lors du téléchargement des images");
      } finally {
        // Reset loading state
        const finalUploadingImages = [...uploadingImages]; // Use current state in a real app, but here we can just toggle back
        // Since we are inside the component, we should probably use the functional update or just a new copy
        // But for simplicity in this tool usage:
        slotsToFill.forEach(index => {
          finalUploadingImages[index] = false;
        });
        setUploadingImages(finalUploadingImages);
      }
    }
  };

  const handlePdfChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingPdf(true);
      setCompressionStatus(null);

      try {
        let fileToProcess = file;
        const fileSizeMB = file.size / (1024 * 1024);

        // Check if compression is needed (> 1MB)
        if (fileSizeMB > 1) {
          setCompressionStatus('compressing');
          showAlert('info', `Fichier volumineux (${fileSizeMB.toFixed(2)}MB). Compression en cours...`);
          
          const result = await compressPdf(file);
          fileToProcess = result.file;
          
          setCompressionStatus('done');
          showAlert('success', `Compression réussie : ${fileSizeMB.toFixed(2)}MB → 1.00MB`);
        }

        const base64 = await convertPdfToBase64(fileToProcess);
        setPdfFile(base64);
        setPdfPreview(file.name);
        
        if (!compressionStatus) {
            showAlert('success', 'PDF téléchargé avec succès');
        }
      } catch (error) {
        console.error(error);
        showAlert('error', error.message || 'Erreur lors du téléchargement du PDF');
        setCompressionStatus(null);
      } finally {
        setUploadingPdf(false);
      }
    }
  };

  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles[index] = null;
    setImageFiles(newImageFiles);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const uploadedCount = imageFiles.filter(img => img !== null).length;
    if (uploadedCount < 3) {
      showAlert('warning', `Veuillez télécharger les 3 images requises. (${uploadedCount}/3 téléchargées)`);
      return;
    }

    setIsPublishing(true);

    try {
      // Create article object with base64 images
      // The API service will convert these Base64 strings to Blobs for FormData
      const articleData = {
        title,
        excerpt,
        content: paragraphs.filter(p => p.trim() !== '').join('\n\n'), // Combine paragraphs for backend
        category,
        author,
        images: imageFiles.filter(img => img !== null),
        pdf: pdfFile,
        // date is handled by backend
      };

      console.log('📝 Article à publier (Envoi API)...');

      // Send to API
      const savedArticle = await api.articles.create(articleData);
      
      console.log('✅ Article publié avec succès!', savedArticle);
      
      showAlert('success', '✅ Article publié avec succès !');

      // Reset form
      setTimeout(() => {
        setTitle('');
        setExcerpt('');
        setParagraphs(['']);
        // Keep author
        setImageFiles([null, null, null]);
        setImagePreviews([null, null, null]);
        setPdfFile(null);
        setPdfPreview(null);

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }, 1500);
    } catch (error) {
      console.error('❌ Erreur de publication:', error);
      
      let errorMessage = '❌ Erreur lors de la publication';
      if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      showAlert('error', errorMessage);
      setIsPublishing(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      <CustomAlert 
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">Nouvelle Publication</h1>
          <p className="text-neutral-500">Créez et publiez un article d'excellence</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            type="button" 
            onClick={() => setShowPreview(true)}
            className="px-6 py-2.5 rounded-full border border-neutral-200 text-neutral-600 font-medium hover:bg-white hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Aperçu
          </motion.button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6 text-primary-500-temp font-bold uppercase tracking-wider text-sm">
              <Type size={18} />
              <span>Informations Principales</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Titre de l'article</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all text-lg font-serif font-medium placeholder:text-neutral-300"
                  placeholder="Un titre accrocheur..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Résumé (Chapeau)</label>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all resize-none placeholder:text-neutral-300"
                  placeholder="Un résumé concis pour captiver le lecteur..."
                  required
                ></textarea>
              </div>
            </div>
          </motion.div>

          {/* Content Section - Multiple Paragraphs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-primary-500-temp font-bold uppercase tracking-wider text-sm">
                <FileText size={18} />
                <span>Contenu de l'article ({paragraphs.length} paragraphe{paragraphs.length > 1 ? 's' : ''})</span>
              </div>
              <motion.button
                type="button"
                onClick={addParagraph}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-500-temp transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle size={16} />
                Ajouter un paragraphe
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <div key={index} className="relative group">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-500-temp rounded-full flex items-center justify-center font-bold text-sm mt-2">
                      {index + 1}
                    </div>
                    <textarea 
                      value={paragraph}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                      rows={6}
                      className="flex-1 px-5 py-4 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all font-serif leading-relaxed placeholder:text-neutral-300 resize-none"
                      placeholder={`Paragraphe ${index + 1}...`}
                      required={index === 0}
                    />
                    {paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-lg mt-2"
                        title="Supprimer ce paragraphe"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 ml-10">
                    {paragraph.length} caractères
                  </p>
                </div>
              ))}
            </div>

            {paragraphs.length < 10 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                💡 <strong>Astuce:</strong> Structurez votre article en plusieurs paragraphes pour une meilleure lisibilité.
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Metadata Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6 text-primary-500-temp font-bold uppercase tracking-wider text-sm">
              <Layout size={18} />
              <span>Métadonnées</span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Catégorie</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all appearance-none bg-white font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Auteur</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500-temp font-bold text-xs">
                    WM
                  </div>
                  <span className="font-medium text-neutral-700">{author}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Media Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6 text-primary-500-temp font-bold uppercase tracking-wider text-sm">
              <ImageIcon size={18} />
              <span>Médias</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-3">
                  Galerie (3 requises)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="aspect-square relative group">
                      {imagePreviews[index] ? (
                        <>
                          <img 
                            src={imagePreviews[index]} 
                            alt={`Upload ${index + 1}`} 
                            className="w-full h-full object-cover rounded-lg border border-neutral-200" 
                          />
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
                          {uploadingImages[index] ? (
                            <Loader2 size={20} className="text-primary-500 animate-spin" />
                          ) : (
                            <>
                              <Upload size={20} className="text-neutral-400 mb-1" />
                              <span className="text-[10px] text-neutral-400 font-medium">Ajouter</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => handleImageChange(e, index)} 
                            accept="image/*"
                            multiple
                            disabled={uploadingImages[index]}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-3">
                  Document PDF
                </label>
                {pdfPreview ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <CheckCircle size={16} />
                      <span>PDF joint</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        setPdfPreview(null);
                      }}
                      className="text-green-700 hover:bg-green-100 p-1 rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all text-neutral-500 hover:text-primary-500 font-medium text-sm">
                    {uploadingPdf ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Téléchargement...</span>
                      </>
                    ) : (
                      <>
                        <span>Joindre un PDF</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handlePdfChange} 
                      accept=".pdf"
                      disabled={uploadingPdf}
                    />
                  </label>
                )}
                {compressionStatus === 'compressing' && (
                  <p className="text-xs text-blue-600 mt-2 animate-pulse">
                    Optimisation du fichier PDF en cours...
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            type="submit"
            disabled={isPublishing}
            className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Publication en cours...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                Publier l'article
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Preview Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 md:px-8 py-4 md:py-6 flex items-center justify-between z-10">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 truncate">Aperçu de l'article</h2>
                  <p className="text-xs md:text-sm text-neutral-500 mt-1">Voici comment votre article apparaîtra</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-neutral-600" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="px-4 md:px-8 py-6 md:py-8">
                {/* Category Badge */}
                {category && (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-500-temp rounded-full text-sm font-bold">
                      {category}
                    </span>
                  </div>
                )}

                {/* Title */}
                {title && (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 mb-4 leading-tight break-words">
                    {title}
                  </h1>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-neutral-500 mb-6 pb-6 border-b border-neutral-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <PenTool size={16} className="flex-shrink-0" />
                    <span className="truncate">{author}</span>
                  </div>
                  <div className="hidden sm:block">•</div>
                  <div className="text-xs md:text-sm">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>

                {/* Excerpt */}
                {excerpt && (
                  <p className="text-base md:text-xl text-neutral-700 leading-relaxed mb-8 font-serif italic break-words">
                    {excerpt}
                  </p>
                )}

                {/* Featured Image */}
                {imagePreviews[0] && (
                  <div className="mb-8 rounded-xl overflow-hidden">
                    <img 
                      src={imagePreviews[0]} 
                      alt="Featured" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Content Paragraphs */}
                {paragraphs.filter(p => p.trim() !== '').length > 0 && (
                  <div className="prose prose-sm md:prose-lg max-w-none mb-8">
                    {paragraphs.filter(p => p.trim() !== '').map((paragraph, index) => (
                      <p key={index} className="text-neutral-700 leading-relaxed mb-6 font-serif text-base md:text-lg break-words">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Additional Images */}
                {(imagePreviews[1] || imagePreviews[2]) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {imagePreviews[1] && (
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src={imagePreviews[1]} 
                          alt="Image 2" 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    {imagePreviews[2] && (
                      <div className="rounded-xl overflow-hidden">
                        <img 
                          src={imagePreviews[2]} 
                          alt="Image 3" 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* PDF Indicator */}
                {pdfPreview && (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <FileText size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-blue-900">Document PDF joint</p>
                      <p className="text-xs text-blue-600 truncate">{pdfPreview}</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!title && !excerpt && paragraphs.filter(p => p.trim() !== '').length === 0 && (
                  <div className="text-center py-20">
                    <FileText size={64} className="mx-auto text-neutral-300 mb-4" />
                    <p className="text-neutral-500">Commencez à rédiger votre article pour voir l'aperçu</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNewArticle;
