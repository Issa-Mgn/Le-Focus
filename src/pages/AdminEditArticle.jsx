import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Image as ImageIcon, X, CheckCircle, PenTool, Layout, Type, FileText, Upload, Loader2, PlusCircle, ArrowLeft } from 'lucide-react';
import { categories } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { convertImageToBase64, convertPdfToBase64, compressPdf } from '../utils/imageStorage';
import CustomAlert from '../components/CustomAlert';
import { api } from '../services/api';

const AdminEditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [author, setAuthor] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [paragraphs, setParagraphs] = useState(['']);
  
  // imageFiles holds the NEW files to upload (base64). Elements are null if no NEW file.
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  // imagePreviews holds what to show (URL or base64).
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  
  const [pdfFile, setPdfFile] = useState(null); // New PDF base64
  const [pdfPreview, setPdfPreview] = useState(null); // Name or URL
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState([false, false, false]);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await api.articles.getById(id);
        if (data) {
          setTitle(data.title);
          setCategory(data.category || categories[0]);
          setAuthor(data.author || '');
          setExcerpt(data.excerpt || '');
          
          if (data.paragraphs && data.paragraphs.length > 0) {
            setParagraphs(data.paragraphs);
          } else if (data.content) {
            setParagraphs(data.content.split('\n\n'));
          }

          // Setup Images
          const urls = data.images || [];
          const newPreviews = [null, null, null];
          urls.slice(0, 3).forEach((url, i) => {
            newPreviews[i] = url;
          });
          setImagePreviews(newPreviews);

          // Setup PDF
          if (data.pdf) {
            setPdfPreview(data.pdf); // Will show as URL or handled in UI
          }
        }
      } catch (error) {
        console.error("Failed to fetch article", error);
        showAlert('error', "Impossible de charger l'article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

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
      
      const slotsToFill = [];
      for (let i = 0; i < files.length; i++) {
        if (startIndex + i < 3) {
          slotsToFill.push(startIndex + i);
        }
      }

      if (slotsToFill.length === 0) return;

      const newUploadingImages = [...uploadingImages];
      slotsToFill.forEach(index => {
        newUploadingImages[index] = true;
      });
      setUploadingImages(newUploadingImages);

      const newImageFiles = [...imageFiles];
      const newPreviews = [...imagePreviews];
      let successCount = 0;

      try {
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
        const finalUploadingImages = [...uploadingImages];
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
    
    // Validate based on PREVIEWS (what is visible), not just uploaded files
    const activeImagesCount = imagePreviews.filter(img => img !== null).length;
    if (activeImagesCount < 1) {
       showAlert('warning', 'Veuillez avoir au moins 1 image pour l\'article.');
       return;
    }
    if (activeImagesCount > 3) {
       showAlert('warning', 'Maximum 3 images autorisées.');
       return;
    }

    setIsPublishing(true);

    try {
      const articleData = {
        title,
        excerpt,
        content: paragraphs.filter(p => p.trim() !== '').join('\n\n'),
        category,
        author,
        // Send imageFiles (new uploads). Backend logic usually: if empty, keep old.
        // However, we need to pass existing URLs if the backend wipes them out.
        // But the previous API update logic we wrote only appends if it starts with 'data:'.
        // So simple solution: pass 'imageFiles'. If they are updated, they are sent. 
        // If 'imageFiles' has nulls, we don't send those slots.
        images: imageFiles, 
        pdf: pdfFile,
      };

      console.log('📝 Mise à jour article (Envoi API)...', articleData);

      await api.articles.update(id, articleData);
      
      console.log('✅ Article mis à jour avec succès!');
      showAlert('success', '✅ Article mis à jour avec succès !');

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (error) {
      console.error('❌ Erreur de mise à jour:', error);
      showAlert('error', error.message || 'Erreur lors de la mise à jour');
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 size={40} className="animate-spin text-primary-500" />
        </div>
    );
  }

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
           <button 
             onClick={() => navigate('/admin/dashboard')}
             className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
           >
             <ArrowLeft size={20} />
             Retour au tableau de bord
           </button>
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">Modifier l'article</h1>
          <p className="text-neutral-500">Mettez à jour le contenu de votre journal</p>
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
                  required
                ></textarea>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
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
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
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
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Auteur</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none"
                />
              </div>
            </div>
          </motion.div>

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
                              <span className="text-[10px] text-neutral-400 font-medium">Modifier</span>
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
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium w-full overflow-hidden">
                      <CheckCircle size={16} />
                      <span className="truncate">{pdfPreview.length > 20 ? pdfPreview.substring(0, 20) + '...' : pdfPreview}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        setPdfPreview(null);
                      }}
                      className="text-green-700 hover:bg-green-100 p-1 rounded-full transition-colors flex-shrink-0"
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
                        <span>Remplacer le PDF</span>
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
                <span>Mise à jour...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                Enregistrer les modifications
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Preview Modal intentionally omitted or can be same as NewArticle */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
             <div className="bg-white p-6 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Aperçu rapide</h2>
                 <p className="mb-2"><strong>Titre:</strong> {title}</p>
                 <p className="mb-2"><strong>Résumé:</strong> {excerpt}</p>
                 <button onClick={() => setShowPreview(false)} className="btn-primary mt-4">Fermer</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEditArticle;
