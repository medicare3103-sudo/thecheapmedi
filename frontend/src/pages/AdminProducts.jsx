import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner, Tabs, Tab, Alert } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAuthors, getCategories } from '../api';
import { compressImage, createThumbnail } from '../utils/image';

const defaultReviewer = {
  slug: 'sarah-jenkins',
  name: 'Dr. Sarah Jenkins',
  role: 'Chief Clinical Officer & Medical Review Board Chair (MD, PhD, FACP)',
  badge: 'Medical Expert Board Chair',
  educationShort: 'Doctor of Medicine (MD) - Harvard Medical School, PhD in Pharmacology - MIT',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400',
  aboutSub: 'Certified Clinical Pharmacologist & Internal Medicine Specialist',
  educationList: [
    'Doctor of Medicine (MD) with Honors – Harvard Medical School',
    'PhD in Molecular Pharmacology – Massachusetts Institute of Technology (MIT)',
    'Residency in Internal Medicine – Brigham and Women\'s Hospital',
    'Fellowship in Clinical Pharmacology & Therapeutics – Johns Hopkins University School of Medicine'
  ],
  bioParagraphs: [
    'Dr. Sarah Jenkins is a board-certified internist, clinical pharmacologist, and the chair of the Medical Review Board at Medicare. With over 15 years of experience in academic medicine and clinical research, Dr. Jenkins oversaw drug safety monitoring, clinical trial protocols, and evidence-based pharmaceutical evaluations at Brigham and Women\'s Hospital and Johns Hopkins Medicine.',
    'Her clinical expertise focuses on cardiovascular pharmacology, geriatric pharmacotherapy, and drug-drug interaction safety. At Medicare, Dr. Jenkins directs the clinical review process, ensuring that every product description, safety warning, and medical recommendation is rigorously vetted against the latest FDA approvals, peer-reviewed clinical guidelines, and standard prescribing practices. Her mission is to ensure that patients have access to transparent, medically accurate information to make safe, informed choices about their prescription and over-the-counter care.'
  ],
  isDoctor: true
};

const renderHTMLContent = (content) => {
  if (!content) return null;
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <span>{content}</span>;
};

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<i key={i} className="bi bi-star-half"></i>);
    } else {
      stars.push(<i key={i} className="bi bi-star"></i>);
    }
  }
  return stars;
};

const getActiveIngredient = (name) => {
  if (!name) return 'Active Ingredient';
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('gokshura')) return 'Gokshura / Puga / Varuna';
  if (lowercaseName.includes('moisturizer')) return 'Natural Emollients';
  if (lowercaseName.includes('abacavir') && lowercaseName.includes('lamivudine')) return 'Abacavir / Lamivudine';
  if (lowercaseName.includes('abacavir')) return 'Abacavir Sulfate';
  if (lowercaseName.includes('abatacept')) return 'Abatacept';
  if (lowercaseName.includes('abiraterone')) return 'Abiraterone Acetate';
  if (lowercaseName.includes('acamprosate')) return 'Acamprosate';
  if (lowercaseName.includes('acarbose') && lowercaseName.includes('metformin')) return 'Acarbose / Metformin';
  if (lowercaseName.includes('acarbose')) return 'Acarbose';
  if (lowercaseName.includes('acebrophylline')) return 'Acebrophylline';
  if (lowercaseName.includes('aceclofenac')) return 'Aceclofenac / Paracetamol';
  if (lowercaseName.includes('acetazolamide')) return 'Acetazolamide';
  if (lowercaseName.includes('acetylcysteine')) return 'Acetylcysteine';
  if (lowercaseName.includes('acitretin')) return 'Acitretin';
  if (lowercaseName.includes('acyclovir')) return 'Acyclovir';
  if (lowercaseName.includes('adapalene') && lowercaseName.includes('clindamycin')) return 'Adapalene / Clindamycin';
  if (lowercaseName.includes('adapalene')) return 'Adapalene';
  if (lowercaseName.includes('adefovir')) return 'Adefovir';
  if (lowercaseName.includes('afatinib')) return 'Afatinib Dimaleate';
  if (lowercaseName.includes('albendazole')) return 'Albendazole';
  if (lowercaseName.includes('alectinib')) return 'Alectinib';
  if (lowercaseName.includes('alendronate')) return 'Alendronate Sodium';
  if (lowercaseName.includes('alfacalcidol')) return 'Alfacalcidol';
  if (lowercaseName.includes('alfuzosin')) return 'Alfuzosin';
  if (lowercaseName.includes('tretinoin') || lowercaseName.includes('retinoic')) return 'Tretinoin';
  return 'Active Ingredient';
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeTab, setActiveTab] = useState('vital');
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [focusKeywordInput, setFocusKeywordInput] = useState('');
  
  // Form State
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    manufacturer: '',
    category: '',
    price: '',
    stock: '',
    pack_sizes: [],
    image_url: '',
    image_thumbnail: '',
    description: '',
    tags: [],
    uses: '',
    dosage: '',
    side_effects: '',
    active_ingredient: '',
    rx_required: false,
    referred_by_doctor: '',
    doctor_title: '',
    doctor_institution: '',
    doctor_image_url: '',
    doctor_advice: '',
    reviewer_slug: '',
    writer_slug: '',
    is_featured: false,
    is_trending: false,
    is_bestselling: false,
    indication: '',
    packaging: '',
    strength: '',
    delivery_time: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    faqs: []
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAuthors();
    fetchCategories();
  }, []);

  const handleShowModal = async (mode, product = null) => {
    setModalMode(mode);
    setShowPreview(false); // Reset preview mode
    setActiveTab('vital'); // Reset to first tab
    setErrors({}); // Clear validation errors
    if (mode === 'edit' && product) {
      setCurrentProductId(product.id);
      // Set lean data immediately so modal opens fast
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        manufacturer: product.manufacturer || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || 0,
        pack_sizes: product.pack_sizes || [],
        image_url: product.image_url === '__has_image__' ? '' : (product.image_url || ''),
        image_thumbnail: '',
        description: '',
        tags: product.tags || [],
        uses: '',
        dosage: '',
        side_effects: '',
        active_ingredient: product.active_ingredient || '',
        rx_required: product.rx_required || false,
        referred_by_doctor: product.referred_by_doctor || '',
        doctor_title: product.doctor_title || '',
        doctor_institution: product.doctor_institution || '',
        doctor_image_url: '',
        doctor_advice: '',
        reviewer_slug: product.reviewer_slug || '',
        writer_slug: product.writer_slug || '',
        is_featured: product.is_featured || false,
        is_trending: product.is_trending || false,
        is_bestselling: product.is_bestselling || false,
        indication: product.indication || '',
        packaging: product.packaging || '',
        strength: product.strength || '',
        delivery_time: product.delivery_time || '',
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        focus_keyword: product.focus_keyword || '',
        faqs: []
      });
      setTagInput('');
      setFocusKeywordInput('');
      setShowModal(true);
      // Fetch full product data in background to get description, image, etc.
      setLoadingProduct(true);
      try {
        const fullProduct = await getProduct(product.id);
        setFormData({
          name: fullProduct.name || '',
          brand: fullProduct.brand || '',
          manufacturer: fullProduct.manufacturer || '',
          category: fullProduct.category || '',
          price: fullProduct.price || '',
          stock: fullProduct.stock || 0,
          pack_sizes: fullProduct.pack_sizes || [],
          image_url: fullProduct.image_url || '',
          image_thumbnail: fullProduct.image_thumbnail || '',
          description: fullProduct.description || '',
          tags: fullProduct.tags || [],
          uses: fullProduct.uses || '',
          dosage: fullProduct.dosage || '',
          side_effects: fullProduct.side_effects || '',
          active_ingredient: fullProduct.active_ingredient || '',
          rx_required: fullProduct.rx_required || false,
          referred_by_doctor: fullProduct.referred_by_doctor || '',
          doctor_title: fullProduct.doctor_title || '',
          doctor_institution: fullProduct.doctor_institution || '',
          doctor_image_url: fullProduct.doctor_image_url || '',
          doctor_advice: fullProduct.doctor_advice || '',
          reviewer_slug: fullProduct.reviewer_slug || '',
          writer_slug: fullProduct.writer_slug || '',
          is_featured: fullProduct.is_featured || false,
          is_trending: fullProduct.is_trending || false,
          is_bestselling: fullProduct.is_bestselling || false,
          indication: fullProduct.indication || '',
          packaging: fullProduct.packaging || '',
          strength: fullProduct.strength || '',
          delivery_time: fullProduct.delivery_time || '',
          meta_title: fullProduct.meta_title || '',
          meta_description: fullProduct.meta_description || '',
          focus_keyword: fullProduct.focus_keyword || '',
          faqs: fullProduct.faqs || []
        });
      } catch (err) {
        console.error('Failed to load full product data:', err);
      } finally {
        setLoadingProduct(false);
      }
    } else {
      setCurrentProductId(null);
      setLoadingProduct(false);
      setFormData({
        name: '',
        brand: '',
        manufacturer: '',
        category: '',
        price: '',
        stock: '',
        pack_sizes: [],
        image_url: '',
        description: '',
        tags: [],
        uses: '',
        dosage: '',
        side_effects: '',
        active_ingredient: '',
        rx_required: false,
        referred_by_doctor: '',
        doctor_title: '',
        doctor_institution: '',
        doctor_image_url: '',
        doctor_advice: '',
        reviewer_slug: '',
        writer_slug: '',
        is_featured: false,
        is_trending: false,
        is_bestselling: false,
        indication: '',
        packaging: '',
        strength: '',
        delivery_time: '',
        meta_title: '',
        meta_description: '',
        focus_keyword: '',
        faqs: []
      });
      setTagInput('');
      setFocusKeywordInput('');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPreview(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Tag management handlers
  const handleAddTag = () => {
    const raw = tagInput.trim();
    if (!raw) return;
    // Support comma-separated tags in one go
    const newTags = raw.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
    setFormData(prev => ({
      ...prev,
      tags: [...new Set([...(prev.tags || []), ...newTags])]
    }));
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
    if (e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  // Focus Keyword Tag management handlers
  const handleAddFocusKeyword = () => {
    const raw = focusKeywordInput.trim();
    if (!raw) return;
    const newKws = raw.split(',').map(k => k.trim()).filter(Boolean);
    const currentKws = formData.focus_keyword ? formData.focus_keyword.split(',').map(k => k.trim()).filter(Boolean) : [];
    
    const updatedKws = [...currentKws];
    newKws.forEach(kw => {
      if (!updatedKws.some(k => k.toLowerCase() === kw.toLowerCase())) {
        updatedKws.push(kw);
      }
    });
    
    setFormData(prev => ({
      ...prev,
      focus_keyword: updatedKws.join(', ')
    }));
    setFocusKeywordInput('');
  };

  const handleFocusKeywordKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFocusKeyword();
    }
    if (e.key === ',') {
      e.preventDefault();
      handleAddFocusKeyword();
    }
  };

  const handleRemoveFocusKeyword = (kwToRemove) => {
    const currentKws = formData.focus_keyword ? formData.focus_keyword.split(',').map(k => k.trim()).filter(Boolean) : [];
    const updatedKws = currentKws.filter(k => k !== kwToRemove);
    setFormData(prev => ({
      ...prev,
      focus_keyword: updatedKws.join(', ')
    }));
  };

  // Slugify helper matching backend behavior
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start
      .replace(/-+$/, ''); // Trim - from end
  };

  const analyzeSEO = () => {
    const name = formData.name || '';
    const descRaw = formData.description || '';
    const descText = descRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const descWords = descText.split(/\s+/).filter(Boolean);
    const descWordCount = descWords.length;
    
    const metaTitle = formData.meta_title || '';
    const metaDesc = formData.meta_description || '';
    const keywords = formData.focus_keyword ? formData.focus_keyword.split(',').map(k => k.trim()).filter(Boolean) : [];
    
    let totalScore = 0;
    let maxScore = 0;
    
    const baseChecks = [
      {
        id: 'title_len',
        label: 'Meta Title Length',
        passed: metaTitle.length >= 40 && metaTitle.length <= 60,
        info: `Current: ${metaTitle.length} chars. Recommended: 40-60 chars.`,
        points: 10
      },
      {
        id: 'desc_len',
        label: 'Meta Description Length',
        passed: metaDesc.length >= 120 && metaDesc.length <= 160,
        info: `Current: ${metaDesc.length} chars. Recommended: 120-160 chars.`,
        points: 10
      },
      {
        id: 'prod_desc_len',
        label: 'Product Description Word Count',
        passed: descWordCount >= 100,
        info: `Current: ${descWordCount} words. Recommended: 100+ words for rich product details.`,
        points: 15
      },
      {
        id: 'has_image',
        label: 'Product Image',
        passed: !!formData.image_url,
        info: formData.image_url ? 'Product has an image.' : 'Add a product image to display in search snippet previews.',
        points: 10
      }
    ];

    baseChecks.forEach(c => {
      maxScore += c.points;
      if (c.passed) totalScore += c.points;
    });

    const keywordChecks = [];
    
    keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const matches = descText.match(new RegExp(`\\b${escapedKw}\\b`, 'gi')) || [];
      const count = matches.length;
      const density = descWordCount > 0 ? (count / descWordCount) * 100 : 0;
      
      const kwInName = name.toLowerCase().includes(kwLower);
      const kwInMetaTitle = metaTitle.toLowerCase().includes(kwLower);
      const kwInMetaDesc = metaDesc.toLowerCase().includes(kwLower);
      
      const slugifiedName = slugify(name);
      const slugifiedKeyword = slugify(kw);
      const kwInSlug = slugifiedKeyword && slugifiedName.includes(slugifiedKeyword);
      
      const first100Words = descWords.slice(0, 100).join(' ').toLowerCase();
      const kwInIntro = first100Words.includes(kwLower);
      
      const densityPassed = density >= 0.5 && density <= 2.5;
      
      const checks = [
        {
          id: 'kw_name',
          label: `"${kw}" in Product Name`,
          passed: kwInName,
          info: kwInName ? 'Keyword is present in Product Name.' : 'Try to include the focus keyword in the Product Name.',
          points: 15
        },
        {
          id: 'kw_meta_title',
          label: `"${kw}" in Meta Title`,
          passed: kwInMetaTitle,
          info: kwInMetaTitle ? 'Keyword is present in Meta Title.' : 'Try to include the focus keyword in the Meta Title.',
          points: 10
        },
        {
          id: 'kw_meta_desc',
          label: `"${kw}" in Meta Description`,
          passed: kwInMetaDesc,
          info: kwInMetaDesc ? 'Keyword is present in Meta Description.' : 'Try to include the focus keyword in the Meta Description.',
          points: 10
        },
        {
          id: 'kw_density',
          label: `"${kw}" Density in Description`,
          passed: densityPassed,
          info: `Density is ${density.toFixed(2)}% (${count} matches). Recommended: 0.5% - 2.5% (approx. 1-3 times per 100 words).`,
          points: 10
        },
        {
          id: 'kw_intro',
          label: `"${kw}" in first 100 words of Description`,
          passed: kwInIntro,
          info: kwInIntro ? 'Keyword is present in the introduction.' : 'Include the focus keyword in the first 100 words of the description.',
          points: 10
        },
        {
          id: 'kw_slug',
          label: `"${kw}" in Product URL/Slug`,
          passed: kwInSlug,
          info: kwInSlug ? 'Keyword matches the product URL slug.' : 'The keyword should appear in the product slug (auto-generated from name).',
          points: 10
        }
      ];

      checks.forEach(c => {
        maxScore += c.points;
        if (c.passed) totalScore += c.points;
      });
      
      keywordChecks.push({
        keyword: kw,
        checks
      });
    });

    const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      score: finalScore,
      baseChecks,
      keywordChecks,
      hasKeywords: keywords.length > 0
    };
  };

  const applySEOFix = (checkId, kw = null) => {
    setFormData(prev => {
      const updated = { ...prev };
      const name = prev.name || '';
      const metaTitle = prev.meta_title || '';
      const metaDesc = prev.meta_description || '';
      const descRaw = prev.description || '';
      
      switch (checkId) {
        case 'title_len':
          if (metaTitle.length > 60) {
            updated.meta_title = metaTitle.substring(0, 57) + '...';
          } else if (metaTitle.length < 40) {
            const padText = ` - Buy Online | The Cheap Pharma`;
            const combined = metaTitle ? `${metaTitle}${padText}` : `${name}${padText}`;
            updated.meta_title = combined.substring(0, 60);
          }
          break;
          
        case 'desc_len':
          if (metaDesc.length > 160) {
            updated.meta_description = metaDesc.substring(0, 157) + '...';
          } else if (metaDesc.length < 120) {
            const suffix = ` Safe checkout, fast worldwide shipping, and verified WHO-GMP quality medicines at The Cheap Pharma.`;
            const combined = metaDesc ? `${metaDesc}${suffix}` : `Buy ${name} online today.${suffix}`;
            updated.meta_description = combined.substring(0, 160);
          }
          break;
          
        case 'prod_desc_len': {
          const descText = descRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          const descWords = descText.split(/\s+/).filter(Boolean);
          if (descWords.length < 100) {
            const extraParagraph = `\n\n<p><strong>Clinical Overview & Safety:</strong> This medicine is manufactured in WHO-GMP certified facilities. Please consult your physician or healthcare advisor prior to starting a course. Follow standard medical recommendations for dosage, side effects, and precautions. Always read the packaging details before use and store safely out of reach of children.</p>`;
            updated.description = descRaw + extraParagraph;
          }
          break;
        }
        
        case 'has_image':
          if (!prev.image_url) {
            updated.image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60';
          }
          break;
          
        case 'kw_name':
          if (kw && !name.toLowerCase().includes(kw.toLowerCase())) {
            const cleanName = name.replace(/\s*\(.*?\)\s*$/g, '').trim();
            updated.name = `${cleanName} (${kw})`;
          }
          break;
          
        case 'kw_meta_title':
          if (kw && !metaTitle.toLowerCase().includes(kw.toLowerCase())) {
            const separator = metaTitle ? ' - ' : '';
            const combined = `${metaTitle}${separator}Buy ${kw} Online`;
            updated.meta_title = combined.substring(0, 60);
          }
          break;
          
        case 'kw_meta_desc':
          if (kw && !metaDesc.toLowerCase().includes(kw.toLowerCase())) {
            const separator = metaDesc ? '. ' : '';
            const combined = `Save on ${kw}${separator}${metaDesc}`;
            updated.meta_description = combined.substring(0, 160);
          }
          break;
          
        case 'kw_density':
          if (kw) {
            const descText = descRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (!descText.toLowerCase().includes(kw.toLowerCase())) {
              const sentence = `\n\n<p>Our pharmacists recommend discussing <strong>${kw}</strong> details with a licensed professional to ensure proper guidelines are met.</p>`;
              updated.description = descRaw + sentence;
            }
          }
          break;
          
        case 'kw_intro':
          if (kw) {
            const sentence = `<p>This guide covers <strong>${kw}</strong> indications, active ingredients, and critical patient safety instructions.</p>\n`;
            updated.description = sentence + descRaw;
          }
          break;
          
        case 'kw_slug':
          if (kw && !name.toLowerCase().includes(kw.toLowerCase())) {
            const cleanName = name.replace(/\s*\(.*?\)\s*$/g, '').trim();
            updated.name = `${cleanName} (${kw})`;
          }
          break;
          
        default:
          break;
      }
      
      return updated;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const original = reader.result;
        // Compress full image for product detail page
        const compressed = await compressImage(original, 500, 500, 0.65);
        // Create tiny thumbnail for list/card views (much smaller payload)
        const thumbnail = await createThumbnail(original);
        setFormData(prev => ({
          ...prev,
          image_url: compressed,
          image_thumbnail: thumbnail
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPackSize = () => {
    setFormData(prev => ({
      ...prev,
      pack_sizes: [...(prev.pack_sizes || []), { size: '', price: '' }]
    }));
  };

  const handleRemovePackSize = (index) => {
    setFormData(prev => ({
      ...prev,
      pack_sizes: prev.pack_sizes.filter((_, i) => i !== index)
    }));
  };

  const handlePackSizeChange = (index, field, value) => {
    const newPackSizes = [...(formData.pack_sizes || [])];
    newPackSizes[index] = { ...newPackSizes[index], [field]: value };
    setFormData(prev => ({ ...prev, pack_sizes: newPackSizes }));
  };

  const handleVariationKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPackSize();
    }
  };

  const handleFAQKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFAQ();
    }
  };

  const handleAddFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  const handleRemoveFAQ = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== index)
    }));
  };

  const handleFAQChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.faqs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category selection is required';
    }
    
    if (formData.price === '' || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }
    
    if (formData.stock === '' || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }
    
    // Check variations
    if (formData.pack_sizes && formData.pack_sizes.length > 0) {
      const invalidPackSizes = formData.pack_sizes.some(ps => !ps.size.trim() || ps.price === '' || isNaN(parseFloat(ps.price)) || parseFloat(ps.price) <= 0);
      if (invalidPackSizes) {
        newErrors.pack_sizes = 'All variations must have a size and a price greater than 0';
      }
    }
    
    setErrors(newErrors);
    
    // Auto-switch tabs to first error
    if (newErrors.name || newErrors.category) {
      setActiveTab('vital');
    } else if (newErrors.price || newErrors.stock) {
      setActiveTab('offer');
    } else if (newErrors.pack_sizes) {
      setActiveTab('variations');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please check all tabs in the form for validation errors (e.g. empty required fields, invalid price/stock, or empty FAQs/variations).');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        // Filter out incomplete/invalid variations and ensure floats are parsed properly
        pack_sizes: (formData.pack_sizes || [])
          .filter(ps => ps.size && ps.price !== '' && !isNaN(parseFloat(ps.price)))
          .map(ps => ({ size: ps.size.trim(), price: parseFloat(ps.price) })),
        faqs: (formData.faqs || [])
          .filter(faq => faq.question.trim() && faq.answer.trim())
          .map(faq => ({ question: faq.question.trim(), answer: faq.answer.trim() }))
      };

      if (modalMode === 'add') {
        await createProduct(payload);
        alert('Product added successfully!');
      } else if (modalMode === 'edit') {
        await updateProduct(currentProductId, payload);
        alert('Product updated successfully!');
      }
      
      handleCloseModal();
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMsg = error.response?.data?.detail 
        ? (typeof error.response.data.detail === 'string' 
            ? error.response.data.detail 
            : JSON.stringify(error.response.data.detail)) 
        : error.message;
      alert(`Failed to save product: ${errorMsg}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? products.map(p => p.id) : []);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected product${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteProduct(id)));
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Some products could not be deleted.');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Helper to check if required fields are filled to enable the save button
  const isFormValid = () => {
    return formData.name && formData.price !== '' && formData.stock !== '';
  };

  const renderProductPreview = () => {
    const activeReviewer = authors.find(a => a.slug === formData.reviewer_slug) || {
      slug: formData.reviewer_slug || 'sarah-jenkins',
      name: formData.referred_by_doctor || defaultReviewer.name,
      role: formData.doctor_title ? `${formData.doctor_title}` : defaultReviewer.role,
      educationShort: formData.doctor_institution || defaultReviewer.educationShort,
      image: formData.doctor_image_url || defaultReviewer.image,
      badge: 'Medical Expert Board Member',
      bioParagraphs: defaultReviewer.bioParagraphs
    };

    const activeWriter = authors.find(a => a.slug === formData.writer_slug);
    const doctorAdvice = formData.doctor_advice || "As a clinical pharmacologist, I advise taking this medication exactly as directed by your healthcare provider. Ensure you discuss any other ongoing prescriptions or potential allergies before starting treatment.";
    const rxRequired = formData.rx_required !== undefined ? formData.rx_required : (formData.category === 'Antibiotics' || formData.category === 'Diabetes' || formData.category === 'Asthma' || formData.category === 'Blood Pressure' || formData.category === 'Men\'s Health' || formData.category === 'Women\'s Health' || formData.category === 'Anti Cancer' || formData.category === 'HIV & Herpes' || formData.category === 'Pain Relief');

    const getProductDetailPriceDisplay = () => {
      if (formData.pack_sizes && formData.pack_sizes.length > 0) {
        const prices = formData.pack_sizes
          .filter(p => p.price !== '' && !isNaN(parseFloat(p.price)))
          .map(p => parseFloat(p.price));
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          if (minPrice === maxPrice) {
            return `$${minPrice.toFixed(2)}`;
          }
          return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
        }
      }
      return formData.price ? `$${parseFloat(formData.price).toFixed(2)}` : '$0.00';
    };

    return (
      <div className="product-preview-container bg-light p-3 rounded-4 border">
        {/* Preview Alert */}
        <Alert variant="info" className="d-flex align-items-center justify-content-between mb-4 border-0 shadow-sm py-2.5 px-3" style={{ borderRadius: '10px' }}>
          <div className="small">
            <i className="bi bi-eye-fill me-2 fs-5 text-info"></i>
            <strong>Live Preview Mode:</strong> This simulates how the product page will look to customers. Switch back to <strong>Edit Form</strong> to make changes.
          </div>
          <Badge bg="info" className="text-white px-2.5 py-1.5 fw-bold">Unsaved Draft</Badge>
        </Alert>

        <Container className="bg-white p-4 rounded-4 shadow-sm border border-light" style={{ maxWidth: '1100px' }}>
          {/* Breadcrumb (Simulated, links disabled) */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><span className="text-primary text-decoration-none cursor-not-allowed" style={{ cursor: 'not-allowed' }}>Home</span></li>
              <li className="breadcrumb-item"><span className="text-primary text-decoration-none cursor-not-allowed" style={{ cursor: 'not-allowed' }}>Products</span></li>
              <li className="breadcrumb-item"><span className="text-primary text-decoration-none cursor-not-allowed" style={{ cursor: 'not-allowed' }}>{formData.category || 'Category'}</span></li>
              <li className="breadcrumb-item active" aria-current="page">{formData.name || 'New Product'}</li>
            </ol>
          </nav>

          {/* TOP SECTION: Image & Main Details */}
          <Row className="mb-5">
            {/* Product Image Column */}
            <Col md={5} className="mb-4 mb-md-0">
              <div className="bg-light rounded-4 p-4 text-center border border-light shadow-xs" style={{ position: 'sticky', top: '20px' }}>
                {formData.image_url ? (
                  <img src={formData.image_url} alt={formData.name} className="img-fluid mx-auto" style={{ maxHeight: '350px', objectFit: 'contain', display: 'inline-block' }} />
                ) : (
                  <div className="text-muted py-5"><i className="bi bi-image fs-1 d-block mb-2 opacity-50"></i>No Image Uploaded Yet</div>
                )}
                {/* Trust Badges */}
                <div className="mt-4 pt-3 border-top d-flex justify-content-around text-muted small" style={{ fontSize: '0.8rem' }}>
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-shield-check text-success fs-5"></i>
                    <span className="fw-semibold">100% Genuine</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-truck text-primary fs-5"></i>
                    <span className="fw-semibold">Secure Shipping</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Product Info Column */}
            <Col md={7} className="ps-md-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge-pill-category"><i className="bi bi-tag-fill me-1.5"></i>{formData.category || 'Uncategorized'}</span>
                {rxRequired ? (
                  <span className="badge-pill-rx"><i className="bi bi-file-earmark-medical-fill me-1.5"></i>Rx Required</span>
                ) : (
                  <span className="badge-pill-otc"><i className="bi bi-check-circle-fill me-1.5"></i>OTC Product</span>
                )}
              </div>
              <h1 className="fw-bold mb-1" style={{ fontSize: '2rem', color: '#0f172a' }}>{formData.name || 'Product Title Go Here'}</h1>
              <p className="text-muted mb-3 fw-500">By <span className="text-dark">{formData.manufacturer || 'Generic Pharma'}</span></p>

              {/* Writer & Medical Reviewer Banner */}
              <div className="medical-review-banner d-flex align-items-center flex-wrap gap-2 py-2 px-3 bg-light rounded-3 mb-3 border border-light" style={{ fontSize: '0.85rem' }}>
                {activeWriter && (
                  <div className="medical-review-row">
                    <span className="text-secondary">
                      Written by <span className="fw-bold text-dark cursor-not-allowed" style={{ cursor: 'not-allowed' }}>{activeWriter.name}</span>
                    </span>
                  </div>
                )}
                {activeWriter && <span className="reviewer-divider text-muted mx-2">|</span>}
                <div className="medical-review-row d-flex align-items-center gap-1">
                  <span className="d-flex align-items-center fw-bold text-success me-1">
                    <i className="bi bi-patch-check-fill me-1"></i> Medically Reviewed
                  </span>
                  <span className="reviewer-divider text-muted mx-2">|</span>
                  <span className="reviewer-info-wrap d-flex align-items-center gap-1">
                    {activeReviewer.image && (
                      <img 
                        src={activeReviewer.image} 
                        className="rounded-circle reviewer-avatar" 
                        alt={activeReviewer.name} 
                        style={{ width: '20px', height: '20px', objectFit: 'cover' }}
                      />
                    )}
                    <span className="text-secondary ms-1">
                      By <span className="fw-bold text-dark cursor-not-allowed" style={{ cursor: 'not-allowed' }}>{activeReviewer.name}</span>
                    </span>
                    {activeReviewer.role && (
                      <>
                        <span className="text-muted mx-1">•</span>
                        <span className="reviewer-role text-muted">{activeReviewer.role}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Stars display */}
              <div className="mb-3 d-flex align-items-center">
                <span className="d-flex align-items-center text-warning me-2" style={{ gap: '2px', fontSize: '0.95rem' }}>
                  {renderStars(5)}
                </span>
                <span className="text-muted">(3 Reviews)</span>
                <span className="text-muted mx-2">•</span>
                <span className="text-primary cursor-not-allowed small fw-bold d-flex align-items-center" style={{ cursor: 'not-allowed' }}><i className="bi bi-chat-left-text me-1"></i> Talk to Expert</span>
              </div>

              {/* Specifications Table */}
              <div className="mb-4 rounded-4 overflow-hidden border shadow-xs" style={{ borderColor: '#e2e8f0' }}>
                <table className="specs-table table mb-0 align-middle" style={{ borderCollapse: 'separate', width: '100%' }}>
                  <tbody>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <td className="py-2.5 px-4 fw-bold text-dark" style={{ width: '35%', fontSize: '0.85rem' }}>Active Ingredient:</td>
                      <td className="py-2.5 px-4 text-secondary" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                        {formData.active_ingredient || getActiveIngredient(formData.name)}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Indication:</td>
                      <td className="py-2.5 px-4 text-secondary" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                        {formData.indication || 'General Treatment'}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Manufacturer:</td>
                      <td className="py-2.5 px-4 text-primary fw-semibold" style={{ fontStyle: 'italic', fontSize: '0.85rem', textDecoration: 'underline' }}>
                        {formData.manufacturer || 'Generic Manufacturer'}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                      <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Packaging:</td>
                      <td className="py-2.5 px-4 text-secondary" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                        {formData.packaging || '30 Tablets'}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Strength:</td>
                      <td className="py-2.5 px-4 text-secondary" style={{ fontSize: '0.85rem' }}>
                        {formData.strength || '100mg'}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: '#ffffff' }}>
                      <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Delivery Time:</td>
                      <td className="py-2.5 px-4 text-secondary" style={{ fontSize: '0.85rem' }}>
                        {formData.delivery_time || '6 To 15 days'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SEO Tags / Keywords Section */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-tags-fill text-muted" style={{ fontSize: '0.85rem' }}></i>
                    <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Keywords:</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="d-inline-flex align-items-center gap-1 px-2.5 py-1"
                        style={{
                          background: '#f0f4ff',
                          color: '#3b5bdb',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          border: '1px solid #c5d0fa',
                        }}
                      >
                        <i className="bi bi-hash" style={{ fontSize: '0.7rem', opacity: 0.7 }}></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price display */}
              <h2 className="text-primary fw-bold mb-3" style={{ fontSize: '1.8rem' }}>{getProductDetailPriceDisplay()}</h2>

              {/* Description preview snippet */}
              <div className="mb-4 text-secondary lh-lg" style={{ fontSize: '0.92rem' }}>
                {formData.description ? (
                  <>
                    {formData.description.replace(/<[^>]+>/g, '').length > 180 ? (
                      <>
                        {formData.description.replace(/<[^>]+>/g, '').substring(0, 180).trim()}...{' '}
                        <span className="text-primary fw-bold cursor-not-allowed ms-1" style={{ cursor: 'not-allowed' }}>Read full description</span>
                      </>
                    ) : (
                      renderHTMLContent(formData.description)
                    )}
                  </>
                ) : (
                  <span className="text-muted italic">No description added yet.</span>
                )}
              </div>

              {/* Pack Sizes / Variations */}
              {formData.pack_sizes && formData.pack_sizes.length > 0 ? (
                <div className="mb-4">
                  <table className="variations-table table mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="py-2.5">Pack Size</th>
                        <th className="py-2.5">Qty</th>
                        <th className="py-2.5">Price</th>
                        <th className="py-2.5 border-start-0 border-end-0" style={{ width: '140px' }}></th>
                        <th className="py-2.5">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.pack_sizes
                        .filter(pack => pack.size)
                        .map((pack, idx) => {
                          const sizeMatch = pack.size.match(/(\d+)/);
                          const tabletCount = sizeMatch ? parseInt(sizeMatch[1]) : 1;
                          const parsedPrice = parseFloat(pack.price) || 0;
                          const unitPrice = (parsedPrice / tabletCount).toFixed(2);
                          return (
                            <tr key={idx}>
                              <td className="py-2.5 fw-bold text-dark">{pack.size}</td>
                              <td className="py-2.5" style={{ width: '90px' }}>
                                <Form.Select size="sm" disabled style={{ borderRadius: '6px' }}>
                                  <option>1</option>
                                </Form.Select>
                              </td>
                              <td className="py-2.5 fw-bold text-dark">${parsedPrice.toFixed(2)}</td>
                              <td className="py-2.5">
                                <Button variant="primary" size="sm" className="fw-bold px-3 rounded-pill shadow-sm text-white border-0 d-inline-flex align-items-center gap-1.5 cursor-not-allowed" style={{ cursor: 'not-allowed' }}>
                                  <i className="bi bi-cart-plus"></i> Add to Cart
                                </Button>
                              </td>
                              <td className="py-2.5 text-secondary fw-semibold">${unitPrice}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="d-flex gap-3 mb-4">
                  <div className="d-flex align-items-center" style={{ width: '80px' }}>
                    <Form.Control type="number" value="1" disabled className="fw-bold text-center" />
                  </div>
                  <Button variant="outline-primary" className="fw-bold px-4 cursor-not-allowed" style={{ cursor: 'not-allowed' }}>Add to Cart</Button>
                  <Button variant="primary" className="fw-bold px-4 cursor-not-allowed" style={{ cursor: 'not-allowed' }}>Buy Now</Button>
                </div>
              )}

              {formData.pack_sizes && formData.pack_sizes.length > 0 && (
                <div className="text-success fw-bold mb-4 d-flex align-items-center small">
                  <i className="bi bi-percent fs-5 me-2"></i>Save more with our biggest pack
                </div>
              )}

              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center small">
                  <span className="fw-500 me-2 text-muted">Availability:</span>
                  {(parseInt(formData.stock) || 0) > 0 ? (
                    <span className="fw-bold text-dark d-flex align-items-center">
                      <span className="status-dot pulsing bg-success d-inline-block rounded-circle me-2" style={{ width: '8px', height: '8px' }}></span>
                      IN STOCK ({formData.stock} units)
                    </span>
                  ) : (
                    <span className="fw-bold text-danger d-flex align-items-center">
                      <span className="status-dot bg-danger d-inline-block rounded-circle me-2" style={{ width: '8px', height: '8px' }}></span>
                      OUT OF STOCK
                    </span>
                  )}
                </div>
                <div className="text-muted small fw-bold" style={{ fontSize: '0.78rem' }}>SKU: CMS{modalMode === 'edit' ? (currentProductId * 1000 + 72) : 'XXXX'}</div>
              </div>

              <hr className="my-4" />

              {/* Doctor's Expert Advice callout card */}
              <div className="card border-start border-4 border-success bg-light p-3 mb-4 rounded-3 shadow-xs border-0">
                <div className="d-flex align-items-center mb-2">
                  {activeReviewer.image && (
                    <img src={activeReviewer.image} className="rounded-circle me-2 border border-2 border-white shadow-sm" style={{ width: '36px', height: '36px', objectFit: 'cover' }} alt={activeReviewer.name} />
                  )}
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.85rem' }}>{activeReviewer.name === "Dr. Sarah Jenkins" ? "Dr. Sarah's" : activeReviewer.name}'s Clinical Advice</h6>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>{activeReviewer.role}</span>
                  </div>
                </div>
                <p className="text-secondary small mb-2 lh-base" style={{ fontStyle: 'italic' }}>
                  "{doctorAdvice}"
                </p>
                <span className="small fw-bold text-primary cursor-not-allowed d-inline-flex align-items-center" style={{ fontSize: '0.8rem', cursor: 'not-allowed' }}>
                  View Full Reviewer Bio & Credentials <i className="bi bi-chevron-right ms-1" style={{ fontSize: '0.7rem' }}></i>
                </span>
              </div>
            </Col>
          </Row>

          {/* BOTTOM SECTION: Detailed Tabs */}
          <Row>
            <Col xs={12}>
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body>
                  <Tabs defaultActiveKey="desc_tab" className="mb-4 custom-tabs">
                    <Tab eventKey="desc_tab" title="Description">
                      <h5 className="fw-bold mb-3 text-dark">Product Description</h5>
                      <div className="text-secondary lh-lg" style={{ fontSize: '0.92rem' }}>
                        {renderHTMLContent(formData.description) || <span className="text-muted italic">No description available.</span>}
                      </div>
                      <p className="text-secondary lh-lg mt-3" style={{ fontSize: '0.92rem' }}>This medication is manufactured by highly reputable pharmaceutical companies and undergoes strict quality control to ensure maximum efficacy and safety.</p>
                    </Tab>
                    
                    <Tab eventKey="reviewer_tab" title="Medical Review Board">
                      <div className="py-3">
                        <Row className="align-items-center gy-4">
                          <Col md={3} className="text-center text-md-start">
                            {activeReviewer.image && (
                              <img 
                                src={activeReviewer.image} 
                                className="rounded-4 img-fluid shadow-sm border border-3 border-white" 
                                style={{ maxWidth: '140px', objectFit: 'cover' }} 
                                alt={activeReviewer.name} 
                              />
                            )}
                          </Col>
                          <Col md={9}>
                            <Badge bg="success" className="mb-2 px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '0.72rem', borderRadius: '50px' }}>
                              ✓ {activeReviewer.badge || 'Medical Review Board Member'}
                            </Badge>
                            <h4 className="fw-bold text-dark mb-1">{activeReviewer.name}</h4>
                            <p className="text-muted small mb-3">
                              <strong>Role/Credentials:</strong> {activeReviewer.role}
                            </p>
                            <div className="text-secondary small lh-lg" style={{ fontSize: '0.88rem' }}>
                              {activeReviewer.bioParagraphs && activeReviewer.bioParagraphs[0] ? (
                                activeReviewer.bioParagraphs[0]
                              ) : (
                                `${activeReviewer.name} is a distinguished member of The Cheap Pharma Medical Review Board. As a qualified healthcare professional, they review product information, active ingredients, dosage recommendations, and clinical safety details to ensure all content is medically accurate and compliant with high quality healthcare standards.`
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const actions = (
    <Button variant="primary" size="sm" onClick={() => handleShowModal('add')} className="fw-bold shadow-sm px-3">
      <i className="bi bi-plus-lg me-2"></i>Add a Product
    </Button>
  );

  return (
    <AdminLayout title="Manage Inventory" actions={actions}>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-action-bar mb-3 d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="bulk-count-badge">{selectedIds.length}</span>
            <span className="fw-semibold text-dark">{selectedIds.length === 1 ? 'product' : 'products'} selected</span>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button type="button" className="bulk-clear-btn" onClick={() => setSelectedIds([])}>
              <i className="bi bi-x-circle me-1"></i> Clear Selection
            </button>
            <button type="button" className="bulk-delete-btn" onClick={handleBulkDelete} disabled={bulkDeleting}>
              {bulkDeleting
                ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Deleting...</>
                : <><i className="bi bi-trash3-fill me-2"></i>Delete {selectedIds.length} Selected</>}
            </button>
          </div>
        </div>
      )}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3" style={{ width: '48px' }}>
                    <input
                      type="checkbox"
                      className="bulk-checkbox"
                      checked={allSelected}
                      ref={el => { if (el) el.indeterminate = someSelected; }}
                      onChange={handleSelectAll}
                      title="Select all"
                    />
                  </th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Product</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Category</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Price</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Stock</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No products found. Add a product to get started!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className={selectedIds.includes(product.id) ? 'bulk-row-selected' : ''}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="bulk-checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => handleToggleSelect(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded d-flex justify-content-center align-items-center me-3" style={{width: '40px', height: '40px', overflow: 'hidden'}}>
                            {product.image_url && product.image_url !== '__has_image__' ? (
                              <img src={product.image_url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            ) : product.image_url === '__has_image__' ? (
                              <i className="bi bi-image-fill text-success" title="Has image" />
                            ) : (
                              <i className="bi bi-image text-muted"></i>
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{product.name}</div>
                            <div className="small text-muted d-flex align-items-center gap-2 flex-wrap mt-1">
                              {product.is_featured && <Badge bg="primary" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Featured</Badge>}
                              {product.is_trending && <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Trending</Badge>}
                              {product.is_bestselling && <Badge bg="success" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Best Seller</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge bg="secondary" className="fw-normal">{product.category || 'Uncategorized'}</Badge>
                      </td>
                      <td className="px-4 py-3 fw-bold">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`fw-500 ${product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="me-2 text-primary shadow-sm fw-bold" onClick={() => handleShowModal('edit', product)}>
                          Edit
                        </Button>
                        <Button variant="light" size="sm" className="text-danger shadow-sm fw-bold" onClick={() => handleDelete(product.id, product.name)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Amazon Seller Style Add/Edit Modal (Fullscreen) */}
      <Modal show={showModal} onHide={handleCloseModal} fullscreen className="seller-modal">
        <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column bg-light">
          {/* Header */}
          <div className="bg-dark text-white px-4 py-3 d-flex justify-content-between align-items-center shadow-sm z-1">
            <h4 className="mb-0 fw-bold">
              {modalMode === 'add' ? 'Add a Product' : `Edit Product: ${formData.name}`}
            </h4>

            {/* Live Preview / Edit Form Toggle */}
            <div className="btn-group shadow-sm bg-secondary bg-opacity-25 rounded-3 p-1">
              <Button 
                variant={!showPreview ? "primary" : "link text-white text-decoration-none"} 
                size="sm" 
                onClick={() => setShowPreview(false)}
                className="fw-bold px-3 py-1.5 border-0 rounded-2"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-pencil-square me-2"></i>Edit Form
              </Button>
              <Button 
                variant={showPreview ? "primary" : "link text-white text-decoration-none"} 
                size="sm" 
                onClick={() => setShowPreview(true)}
                className="fw-bold px-3 py-1.5 border-0 rounded-2"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-eye me-2"></i>Live Preview
              </Button>
            </div>

            <div className="d-flex gap-3 align-items-center">
              <span className="text-white-50 small d-none d-lg-inline">
                <i className="bi bi-info-circle me-1"></i> Ensure all required fields (*) are filled before saving.
              </span>
              <Button variant="outline-light" onClick={handleCloseModal} className="fw-bold px-4">Cancel</Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loadingProduct}
                className="fw-bold px-4 shadow-sm text-nowrap flex-shrink-0"
                style={{ borderRadius: '8px', minWidth: '140px', padding: '10px 20px' }}
              >
                {loadingProduct ? 'Loading...' : 'Save & Finish'}
              </Button>
            </div>
          </div>
          {/* Loading banner when fetching full product */}
          {loadingProduct && (
            <div className="bg-info bg-opacity-10 text-info border-bottom border-info border-opacity-25 px-4 py-2 d-flex align-items-center gap-2 small">
              <Spinner animation="border" size="sm" />
              <span>Loading full product details (description, image)...</span>
            </div>
          )}

          {/* Body with Conditional Rendering */}
          <div className="flex-grow-1 overflow-auto p-4">
            {showPreview ? (
              <Container className="p-0 h-100" style={{maxWidth: '1200px'}}>
                {renderProductPreview()}
              </Container>
            ) : (
              <Container className="bg-white rounded-4 shadow-sm p-4 h-100" style={{maxWidth: '1200px'}}>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-4 custom-seller-tabs border-bottom"
                  variant="underline"
                >
                {/* 1. VITAL INFO TAB */}
                <Tab eventKey="vital" title={<span className="fw-bold px-2 py-1"><i className="bi bi-card-heading me-2"></i>Vital Info</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Product Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.name}
                          placeholder="e.g. Aspirin 500mg Tablets" 
                          className="bg-light border-0 py-2" 
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        <Form.Text className="text-muted">The exact name that will appear on the product listing.</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Manufacturer</Form.Label>
                        <Form.Control type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="e.g. Johnson & Johnson" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Category <span className="text-danger">*</span></Form.Label>
                        <Form.Select 
                          name="category" 
                          value={formData.category} 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.category}
                          className="bg-light border-0 py-2"
                        >
                          <option value="">Select a category...</option>
                          {categories.map(cat => (
                            <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Active Ingredient</Form.Label>
                        <Form.Control type="text" name="active_ingredient" value={formData.active_ingredient} onChange={handleInputChange} placeholder="e.g. Metformin HCl" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Indication</Form.Label>
                        <Form.Control type="text" name="indication" value={formData.indication} onChange={handleInputChange} placeholder="e.g. Erectile Dysfunction" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Packaging</Form.Label>
                        <Form.Control type="text" name="packaging" value={formData.packaging} onChange={handleInputChange} placeholder="e.g. 10 tablets in 1 strip" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Strength</Form.Label>
                        <Form.Control type="text" name="strength" value={formData.strength} onChange={handleInputChange} placeholder="e.g. 200mg" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Delivery Time</Form.Label>
                        <Form.Control type="text" name="delivery_time" value={formData.delivery_time} onChange={handleInputChange} placeholder="e.g. 6 To 15 days" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="d-flex align-items-center">
                      <Form.Group className="mb-0 mt-4">
                        <Form.Check 
                          type="checkbox" 
                          label="Rx Prescription Required" 
                          name="rx_required" 
                          checked={formData.rx_required} 
                          onChange={(e) => setFormData(prev => ({ ...prev, rx_required: e.target.checked }))} 
                          className="fw-bold text-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* 2. OFFER TAB */}
                <Tab eventKey="offer" title={<span className="fw-bold px-2 py-1"><i className="bi bi-tag me-2"></i>Offer</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Standard Price ($) <span className="text-danger">*</span></Form.Label>
                        <div className="input-group has-validation">
                          <span className="input-group-text border-0 bg-light fw-bold text-muted">$</span>
                          <Form.Control 
                            type="number" 
                            step="0.01" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleInputChange} 
                            isInvalid={!!errors.price}
                            placeholder="0.00" 
                            className="bg-light border-0 py-2" 
                          />
                          <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Quantity (Stock) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="number" 
                          name="stock" 
                          value={formData.stock} 
                          onChange={handleInputChange} 
                          isInvalid={!!errors.stock}
                          placeholder="0" 
                          className="bg-light border-0 py-2" 
                        />
                        <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Label className="fw-bold d-block mt-2">Promotional Flags (Home Page Sections)</Form.Label>
                      <Form.Group className="d-flex gap-4 mt-1">
                        <Form.Check 
                          type="checkbox" 
                          label="Featured Product" 
                          name="is_featured" 
                          checked={formData.is_featured} 
                          onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} 
                          className="fw-semibold text-secondary"
                        />
                        <Form.Check 
                          type="checkbox" 
                          label="Trending Product" 
                          name="is_trending" 
                          checked={formData.is_trending} 
                          onChange={(e) => setFormData(prev => ({ ...prev, is_trending: e.target.checked }))} 
                          className="fw-semibold text-secondary"
                        />
                        <Form.Check 
                          type="checkbox" 
                          label="Best Selling Product" 
                          name="is_bestselling" 
                          checked={formData.is_bestselling} 
                          onChange={(e) => setFormData(prev => ({ ...prev, is_bestselling: e.target.checked }))} 
                          className="fw-semibold text-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* 3. VARIATIONS TAB */}
                <Tab eventKey="variations" title={<span className="fw-bold px-2 py-1"><i className="bi bi-diagram-2 me-2"></i>Variations</span>}>
                  <div className="max-w-800">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h6 className="fw-bold mb-1">Pack Sizes</h6>
                        <p className="text-muted small mb-0">Does this product come in different pack sizes? Add them below.</p>
                      </div>
                      <Button variant="outline-primary" onClick={handleAddPackSize} className="fw-bold">
                        <i className="bi bi-plus-lg me-1"></i> Add Variation
                      </Button>
                    </div>
                    
                    {errors.pack_sizes && (
                      <Alert variant="danger" className="py-2.5 px-3 mb-4 border-0 rounded-3 small animate-fade-in">
                        <i className="bi bi-exclamation-circle-fill me-2 fs-6"></i>{errors.pack_sizes}
                      </Alert>
                    )}
                    
                    {(!formData.pack_sizes || formData.pack_sizes.length === 0) ? (
                      <div className="text-center p-5 bg-light rounded-4 border border-dashed text-muted">
                        <i className="bi bi-box-seam fs-1 mb-2 d-block"></i>
                        No variations added. The standard price will be used.
                      </div>
                    ) : (
                      <Table bordered hover className="align-middle">
                        <thead className="bg-light">
                          <tr>
                            <th className="fw-bold text-muted">Size Option (e.g. 30 Tablets)</th>
                            <th className="fw-bold text-muted">Price ($)</th>
                            <th className="fw-bold text-muted">Unit Price (Auto)</th>
                            <th className="fw-bold text-muted text-center" style={{width: '80px'}}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.pack_sizes.map((pack, idx) => {
                            const sizeMatch = pack.size.match(/(\d+)/);
                            const tabletCount = sizeMatch ? parseInt(sizeMatch[1]) : 1;
                            const unitPrice = pack.price ? (parseFloat(pack.price) / tabletCount).toFixed(2) : '0.00';
                            
                            return (
                              <tr key={idx}>
                                <td className="p-2">
                                  <Form.Control 
                                    type="text" 
                                    placeholder="e.g. 30 Tablet/s" 
                                    value={pack.size} 
                                    onChange={(e) => handlePackSizeChange(idx, 'size', e.target.value)} 
                                    onKeyDown={handleVariationKeyDown}
                                    className="border-0 shadow-none bg-transparent" 
                                  />
                                </td>
                                <td className="p-2">
                                  <div className="input-group">
                                    <span className="input-group-text border-0 bg-transparent text-muted">$</span>
                                    <Form.Control 
                                      type="number" 
                                      step="0.01" 
                                      placeholder="0.00" 
                                      value={pack.price} 
                                      onChange={(e) => handlePackSizeChange(idx, 'price', e.target.value)} 
                                      onKeyDown={handleVariationKeyDown}
                                      className="border-0 shadow-none bg-transparent" 
                                    />
                                  </div>
                                </td>
                                <td className="p-2 text-muted fw-500">
                                  ${unitPrice}
                                </td>
                                <td className="p-2 text-center">
                                  <Button variant="link" className="text-danger p-0 border-0" onClick={() => handleRemovePackSize(idx)}>
                                    <i className="bi bi-trash fs-5"></i>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab>

                {/* 4. IMAGES TAB */}
                <Tab eventKey="images" title={<span className="fw-bold px-2 py-1"><i className="bi bi-images me-2"></i>Images</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Upload Product Image (WebP only)</Form.Label>
                        <Form.Control 
                          type="file" 
                          accept="image/webp" 
                          onChange={handleImageUpload} 
                          className="bg-light border-0 py-2" 
                        />
                        <Form.Text className="text-muted">Upload a WebP image file directly from your device.</Form.Text>
                        {formData.image_url && (
                          <div className="mt-2">
                            <Button 
                              type="button" 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                              className="fw-bold animate-fade-in"
                            >
                              <i className="bi bi-trash me-1"></i> Remove Image
                            </Button>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <div className="border rounded-4 p-4 text-center bg-light" style={{minHeight: '300px'}}>
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Preview" style={{maxHeight: '250px', objectFit: 'contain'}} className="rounded" />
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50 pt-5">
                            <i className="bi bi-image fs-1 mb-2"></i>
                            <p>Image preview will appear here</p>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Tab>

                {/* 5. DESCRIPTION TAB */}
                <Tab eventKey="description" title={<span className="fw-bold px-2 py-1"><i className="bi bi-card-text me-2"></i>Description</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Product Description</Form.Label>
                        <RichTextEditor value={formData.description} onChange={(val) => setFormData(prev => ({ ...prev, description: val }))} placeholder="General overview of the product..." />
                        <Form.Text className="text-muted">You can use the toolbar to add links, bold/italic text, and more. HTML formatting is supported.</Form.Text>
                      </Form.Group>
                    </Col>

                    {/* SEO Tags Section */}
                    <Col md={12}>
                      <hr className="my-2" />
                      <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f5e9 100%)', border: '1px solid #d0e8ff' }}>
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 p-2 rounded-3" style={{ background: '#0d6efd22' }}>
                            <i className="bi bi-tags-fill text-primary fs-5"></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0">SEO Tags / Keywords</h6>
                            <small className="text-muted">These tags are injected as meta keywords in the product page &lt;head&gt; for better search engine ranking.</small>
                          </div>
                        </div>

                        {/* Tag Input */}
                        <div className="d-flex gap-2 mb-3">
                          <Form.Control
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Type a tag and press Enter or comma... (e.g. sildenafil, men's health)"
                            className="border-0 shadow-sm"
                            style={{ borderRadius: '8px' }}
                          />
                          <Button
                            type="button"
                            variant="primary"
                            onClick={handleAddTag}
                            className="fw-bold px-3 shadow-sm flex-shrink-0"
                            style={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                          >
                            <i className="bi bi-plus-lg me-1"></i> Add Tag
                          </Button>
                        </div>

                        {/* Tag Badges Display */}
                        {(formData.tags && formData.tags.length > 0) ? (
                          <div className="d-flex flex-wrap gap-2">
                            {formData.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="d-inline-flex align-items-center gap-1 px-3 py-1 fw-semibold"
                                style={{
                                  background: '#e8f0fe',
                                  color: '#1a73e8',
                                  borderRadius: '20px',
                                  fontSize: '0.82rem',
                                  border: '1px solid #c2d9ff'
                                }}
                              >
                                <i className="bi bi-hash" style={{ fontSize: '0.75rem' }}></i>
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="border-0 p-0 ms-1 d-flex align-items-center"
                                  style={{ background: 'none', color: '#1a73e8', cursor: 'pointer', lineHeight: 1 }}
                                  title={`Remove tag: ${tag}`}
                                >
                                  <i className="bi bi-x-circle-fill" style={{ fontSize: '0.85rem' }}></i>
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted" style={{ border: '2px dashed #c2d9ff', borderRadius: '10px', background: '#fff' }}>
                            <i className="bi bi-tags fs-4 mb-1 d-block opacity-50"></i>
                            <small>No tags added yet. Tags improve SEO and product discoverability.</small>
                          </div>
                        )}

                        <div className="mt-3">
                          <small className="text-muted">
                            <i className="bi bi-lightbulb-fill text-warning me-1"></i>
                            <strong>Tip:</strong> Add 5–15 relevant keywords. You can separate multiple tags with commas.
                            Examples: <em>generic viagra, sildenafil citrate, erectile dysfunction, ed pills</em>
                          </small>
                        </div>
                      </div>
                    </Col>




                    {/* Medical Info Section (Clinical Information & Authors Selection) */}
                    <Col md={12} className="mt-4">
                      <div className="medical-info-tab">



                        {/* Authors & Reviewers Section */}
                        <div className="med-section-card">
                          <div className="med-section-header">
                            <div className="med-section-icon" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                              <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Authors &amp; Reviewers</h6>
                              <small className="text-muted">Assign a medical reviewer and editorial author to this product</small>
                            </div>
                          </div>

                          <div className="med-section-body">
                            <Row className="g-3 mb-4">
                              <Col md={6}>
                                <div className="author-select-card reviewer-card">
                                  <div className="author-select-label">
                                    <div className="author-role-badge reviewer-badge">
                                      <i className="bi bi-shield-fill-check me-1"></i> Medical Reviewer
                                    </div>
                                  </div>
                                  <Form.Select
                                    name="reviewer_slug"
                                    value={formData.reviewer_slug || ''}
                                    onChange={handleInputChange}
                                    className="author-select"
                                  >
                                    <option value="">— Select a Doctor / Reviewer —</option>
                                    {authors.filter(a => a.isDoctor).map(author => (
                                      <option key={author.slug} value={author.slug}>{author.name}</option>
                                    ))}
                                  </Form.Select>
                                  {formData.reviewer_slug && (
                                    <div className="author-selected-hint">
                                      <i className="bi bi-person-check-fill text-success me-1"></i>
                                      <small className="text-success fw-semibold">
                                        {authors.find(a => a.slug === formData.reviewer_slug)?.name || formData.reviewer_slug}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="author-select-card writer-card">
                                  <div className="author-select-label">
                                    <div className="author-role-badge writer-badge">
                                      <i className="bi bi-pen-fill me-1"></i> Editorial Author
                                    </div>
                                  </div>
                                  <Form.Select
                                    name="writer_slug"
                                    value={formData.writer_slug || ''}
                                    onChange={handleInputChange}
                                    className="author-select"
                                  >
                                    <option value="">— Select a Writer / Author —</option>
                                    {authors.filter(a => !a.isDoctor).map(author => (
                                      <option key={author.slug} value={author.slug}>{author.name}</option>
                                    ))}
                                  </Form.Select>
                                  {formData.writer_slug && (
                                    <div className="author-selected-hint">
                                      <i className="bi bi-person-check-fill text-primary me-1"></i>
                                      <small className="text-primary fw-semibold">
                                        {authors.find(a => a.slug === formData.writer_slug)?.name || formData.writer_slug}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>

                            {/* Doctor Advice */}
                            <div className="doctor-advice-box">
                              <div className="doctor-advice-header">
                                <i className="bi bi-quote fs-4" style={{ color: '#6366f1', opacity: 0.5 }}></i>
                                <div>
                                  <div className="fw-bold" style={{ color: '#1e293b', fontSize: '0.88rem' }}>Doctor's Expert Advice / Clinical Recommendation</div>
                                  <small className="text-muted">This quote will be shown on the product page as a clinical endorsement</small>
                                </div>
                              </div>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                name="doctor_advice"
                                value={formData.doctor_advice}
                                onChange={handleInputChange}
                                placeholder="Write the clinical advice or recommendation citation from the assigned doctor..."
                                className="doctor-advice-textarea"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </Col>
                  </Row>
                </Tab>

                {/* 6. SEO TAB */}
                <Tab eventKey="seo" title={<span className="fw-bold px-2 py-1"><i className="bi bi-search me-2"></i>SEO Settings</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #f8fafc 100%)', border: '1px solid #cbd5e1' }}>
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 p-2 rounded-3" style={{ background: '#3b82f622' }}>
                            <i className="bi bi-search text-primary fs-5"></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Search Engine Optimization (SEO)</h6>
                            <small className="text-muted">Define custom meta tags to control search results appearances. If blank, default tags are auto-generated.</small>
                          </div>
                        </div>

                        <Row className="g-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold text-secondary small">Custom Meta Title</Form.Label>
                              <Form.Control
                                type="text"
                                name="meta_title"
                                value={formData.meta_title || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Buy Aspirin 500mg Online - Low Prices & Fast Delivery | The Cheap Pharma"
                                className="border-0 shadow-sm"
                                style={{ borderRadius: '8px', padding: '10px 14px' }}
                              />
                              <div className="d-flex justify-content-between mt-1">
                                <Form.Text className="text-muted">
                                  Recommended: 50–60 characters.
                                </Form.Text>
                                <Form.Text className={formData.meta_title && (formData.meta_title.length < 50 || formData.meta_title.length > 60) ? 'text-warning' : 'text-success'}>
                                  {formData.meta_title ? formData.meta_title.length : 0} chars
                                </Form.Text>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-bold text-secondary small">Custom Meta Description</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="meta_description"
                                value={formData.meta_description || ''}
                                onChange={handleInputChange}
                                placeholder="e.g. Save on Aspirin 500mg tablets. Safe checkout, fast shipping, and verified manufacturer details at The Cheap Pharma."
                                className="border-0 shadow-sm"
                                style={{ borderRadius: '8px', padding: '10px 14px' }}
                              />
                              <div className="d-flex justify-content-between mt-1">
                                <Form.Text className="text-muted">
                                  Recommended: 150–160 characters.
                                </Form.Text>
                                <Form.Text className={formData.meta_description && (formData.meta_description.length < 150 || formData.meta_description.length > 160) ? 'text-warning' : 'text-success'}>
                                  {formData.meta_description ? formData.meta_description.length : 0} chars
                                </Form.Text>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold text-secondary small">Focus Keywords / Search Queries</Form.Label>
                              <div className="d-flex gap-2 mb-2">
                                <Form.Control
                                  type="text"
                                  value={focusKeywordInput}
                                  onChange={(e) => setFocusKeywordInput(e.target.value)}
                                  onKeyDown={handleFocusKeywordKeyDown}
                                  placeholder="Type a focus keyword and press Enter or comma..."
                                  className="border-0 shadow-sm"
                                  style={{ borderRadius: '8px', padding: '10px 14px' }}
                                />
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={handleAddFocusKeyword}
                                  className="fw-bold px-3 shadow-sm flex-shrink-0"
                                  style={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                                >
                                  <i className="bi bi-plus-lg me-1"></i> Add Keyword
                                </Button>
                              </div>
                              <Form.Text className="text-muted d-block mb-3">
                                The main keywords or search queries you want this product to rank for. Add multiple keywords to analyze their SEO performance.
                              </Form.Text>

                              {/* Focus Keyword Badges */}
                              {formData.focus_keyword ? (
                                <div className="d-flex flex-wrap gap-2 mb-3">
                                  {formData.focus_keyword.split(',').map(k => k.trim()).filter(Boolean).map((kw, idx) => (
                                    <Badge
                                      key={idx}
                                      bg="primary"
                                      className="d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold shadow-sm text-white"
                                      style={{
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        border: 'none'
                                      }}
                                    >
                                      <i className="bi bi-key-fill text-white-50" style={{ fontSize: '0.75rem' }}></i>
                                      {kw}
                                      <button
                                        type="button"
                                        className="btn-close btn-close-white ms-2"
                                        style={{ fontSize: '0.65rem', outline: 'none', boxShadow: 'none' }}
                                        onClick={() => handleRemoveFocusKeyword(kw)}
                                        aria-label="Remove"
                                      ></button>
                                    </Badge>
                                  ))}
                                </div>
                              ) : null}
                            </Form.Group>
                          </Col>

                          {/* SEO SCORECARD CARD */}
                          <Col md={12}>
                            <div className="mt-2 p-4 rounded-4 bg-white border shadow-sm">
                              <div className="d-flex align-items-center mb-4">
                                <div className="me-3 p-2 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                  <i className="bi bi-patch-check-fill text-success fs-5"></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Real-Time SEO Content Analysis</h6>
                                  <small className="text-muted d-block">Dynamic checklist and keyword optimization grading.</small>
                                  <small className="text-muted d-block mt-1.5" style={{ fontSize: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                                    <i className="bi bi-info-circle me-1 text-primary"></i> Checkboxes are auto-checked when guidelines are met. Click empty checkboxes or the blue <strong>Auto-Fix</strong> buttons to instantly resolve recommendations.
                                  </small>
                                </div>
                              </div>

                              {(() => {
                                const seoResult = analyzeSEO();
                                if (!seoResult.hasKeywords) {
                                  return (
                                    <div className="text-center py-4 px-3 rounded-3 bg-light border border-dashed text-muted animate-fade-in">
                                      <i className="bi bi-info-circle fs-3 mb-2 d-block text-warning"></i>
                                      <div className="fw-bold mb-1">No Focus Keywords Configured</div>
                                      <span className="small text-muted">Add at least one focus keyword above to see live SEO recommendations and overall page score.</span>
                                    </div>
                                  );
                                }

                                const keywordsList = formData.focus_keyword.split(',').map(k => k.trim()).filter(Boolean);

                                return (
                                  <div className="animate-fade-in">
                                    {/* Overall Score Row */}
                                    <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded-3 bg-light border">
                                      <div className="d-flex align-items-center">
                                        <div className="me-3 position-relative" style={{ width: '56px', height: '56px' }}>
                                          <div
                                            className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 text-white shadow-sm"
                                            style={{
                                              width: '56px',
                                              height: '56px',
                                              background: seoResult.score >= 80 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                                          seoResult.score >= 50 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                                                                  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                              transition: 'background 0.3s ease'
                                            }}
                                          >
                                            {seoResult.score}
                                          </div>
                                        </div>
                                        <div>
                                          <h6 className="fw-bold mb-0" style={{ color: '#1e293b' }}>SEO Content Score</h6>
                                          <small className={
                                            seoResult.score >= 80 ? 'text-success fw-bold' :
                                            seoResult.score >= 50 ? 'text-warning fw-bold' :
                                                                    'text-danger fw-bold'
                                          }>
                                            {seoResult.score >= 80 ? 'Excellent Optimization' :
                                             seoResult.score >= 50 ? 'Needs Improvement' :
                                                                     'Poorly Optimized'}
                                          </small>
                                        </div>
                                      </div>
                                      <div className="text-end">
                                        <Badge bg={seoResult.score >= 80 ? 'success' : seoResult.score >= 50 ? 'warning' : 'danger'} className="px-2 py-1.5 fw-semibold text-white">
                                          {keywordsList.length} Keyword{keywordsList.length > 1 ? 's' : ''} Analyzed
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* General SEO Best Practices Checklist */}
                                    <div className="mb-4 p-3 bg-light rounded-3 border">
                                      <div className="fw-bold text-dark mb-3 border-bottom pb-2 small text-uppercase tracking-wider">
                                        <i className="bi bi-sliders me-2 text-primary"></i>General Page Best Practices
                                      </div>
                                      <div className="d-flex flex-column gap-3">
                                        {seoResult.baseChecks.map((check, idx) => (
                                          <div key={idx} className="d-flex align-items-start small">
                                            <div className="d-flex align-items-center me-2 mt-0.5">
                                              <Form.Check 
                                                type="checkbox"
                                                checked={check.passed}
                                                disabled={check.passed}
                                                onChange={() => {
                                                  if (!check.passed) {
                                                    applySEOFix(check.id);
                                                  }
                                                }}
                                                style={{ cursor: check.passed ? 'default' : 'pointer' }}
                                                id={`base-check-${check.id}`}
                                              />
                                            </div>
                                            <div>
                                              <div className="fw-bold text-dark d-flex align-items-center flex-wrap gap-2">
                                                <span>{check.label}</span>
                                                {check.passed ? (
                                                  <Badge bg="success" className="text-white px-1.5 py-0.5" style={{ fontSize: '0.65rem', borderRadius: '4px' }}>
                                                    <i className="bi bi-check-circle-fill me-1"></i> Optimized
                                                  </Badge>
                                                ) : (
                                                  <Badge 
                                                    bg="primary" 
                                                    className="px-1.5 py-0.5 shadow-xs cursor-pointer hover-opacity-85 text-white" 
                                                    style={{ fontSize: '0.65rem', cursor: 'pointer', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }} 
                                                    onClick={() => applySEOFix(check.id)}
                                                  >
                                                    <i className="bi bi-magic me-1"></i> Auto-Fix
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="text-muted">{check.info}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Keyword-Specific Analysis Checklist */}
                                    <div className="p-3 bg-light rounded-3 border">
                                      <div className="fw-bold text-dark mb-3 border-bottom pb-2 small text-uppercase tracking-wider">
                                        <i className="bi bi-file-earmark-check me-2 text-primary"></i>Keyword Analysis Breakdown
                                      </div>
                                      <div className="d-flex flex-column gap-4">
                                        {seoResult.keywordChecks.map((kwCheck, idx) => (
                                          <div key={idx} className={idx > 0 ? "pt-3 border-top" : ""}>
                                            <div className="d-flex align-items-center mb-3">
                                              <Badge bg="info" className="px-3 py-1.5 fw-bold text-white shadow-sm" style={{ fontSize: '0.85rem' }}>
                                                <i className="bi bi-key-fill me-1"></i> {kwCheck.keyword}
                                              </Badge>
                                            </div>
                                            <div className="d-flex flex-column gap-3 ps-1">
                                              {kwCheck.checks.map((c, cIdx) => (
                                                <div key={cIdx} className="d-flex align-items-start small">
                                                  <div className="d-flex align-items-center me-2 mt-0.5">
                                                    <Form.Check 
                                                      type="checkbox"
                                                      checked={c.passed}
                                                      disabled={c.passed}
                                                      onChange={() => {
                                                        if (!c.passed) {
                                                          applySEOFix(c.id, kwCheck.keyword);
                                                        }
                                                      }}
                                                      style={{ cursor: c.passed ? 'default' : 'pointer' }}
                                                      id={`kw-check-${kwCheck.keyword}-${c.id}`}
                                                    />
                                                  </div>
                                                  <div>
                                                    <div className="fw-bold text-dark d-flex align-items-center flex-wrap gap-2">
                                                      <span>{c.label}</span>
                                                      {c.passed ? (
                                                        <Badge bg="success" className="text-white px-1.5 py-0.5" style={{ fontSize: '0.65rem', borderRadius: '4px' }}>
                                                          <i className="bi bi-check-circle-fill me-1"></i> Optimized
                                                        </Badge>
                                                      ) : (
                                                        <Badge 
                                                          bg="primary" 
                                                          className="px-1.5 py-0.5 shadow-xs cursor-pointer hover-opacity-85 text-white" 
                                                          style={{ fontSize: '0.65rem', cursor: 'pointer', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }} 
                                                          onClick={() => applySEOFix(c.id, kwCheck.keyword)}
                                                        >
                                                          <i className="bi bi-magic me-1"></i> Auto-Fix
                                                        </Badge>
                                                      )}
                                                    </div>
                                                    <div className="text-muted">{c.info}</div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Tab>




                </Tabs>
              </Container>
            )}
          </div>
        </Form>
      </Modal>

    </AdminLayout>
  );
}

export default AdminProducts;
