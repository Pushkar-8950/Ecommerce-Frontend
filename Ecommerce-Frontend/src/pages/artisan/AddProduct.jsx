import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AddProduct.css";

function AddProduct() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  // Form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);

  // Product metadata
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pottery");
  const [region, setRegion] = useState("Rajasthan");
  const [description, setDescription] = useState("");

  // UI status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * 1. Trigger hidden file picker
   */
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  /**
   * 2. Send image to Cloudinary via POST /api/upload using multipart/form-data
   */
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show local preview immediately for instant user feedback
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setSelectedFile(file);
    setImageUploadSuccess(false);
    setErrorMessage("");

    // Prepare FormData
    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingImage(true);

    try {
      // POST multipart/form-data to /api/upload
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Extract Cloudinary secure URL from backend response
      const uploadedUrl =
        response.data.data?.url || response.data.url;

      setCloudinaryUrl(uploadedUrl);
      setImageUploadSuccess(true);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to upload image to Cloudinary. Please try again."
      );
      setPreviewUrl("");
      setCloudinaryUrl("");
    } finally {
      setIsUploadingImage(false);
    }
  };

  /**
   * AI Description Generator using POST /api/ai/generate
   */
  const handleGenerateAIDescription = async () => {
    if (!name) {
      setErrorMessage("Please enter a product name first so AI can craft a description.");
      return;
    }

    setIsGeneratingAI(true);
    setErrorMessage("");

    try {
      const prompt = `Write an authentic, evocative 2-sentence marketing description for an artisan handcrafted product named "${name}" from ${region}, belonging to the "${category}" category. Highlight its traditional craftsmanship.`;

      const response = await api.post("/ai/generate", { prompt });
      const aiText = response.data.data?.text || response.data.text;
      setDescription(aiText);
    } catch (err) {
      console.error("AI Generation error:", err);
      setErrorMessage(
        err.response?.data?.message || "Failed to generate AI description."
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  /**
   * 3. Final product creation submission using the returned Cloudinary URL
   */
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!cloudinaryUrl) {
      setErrorMessage("Please upload a product image to Cloudinary before proceeding.");
      return;
    }

    if (!name || !price) {
      setErrorMessage("Please fill in the product name and price.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Payload combining form details with the Cloudinary image URL
      const productPayload = {
        name: name.trim(),
        price: Number(price),
        category,
        region,
        description: description.trim(),
        image: cloudinaryUrl, // Secure Cloudinary URL from step 2
      };

      // In production, posts to POST /api/artisan/products or /api/products
      try {
        await api.post("/artisan/products", productPayload);
      } catch (postErr) {
        // Fallback endpoint if specific artisan route is mounted under general catalog
        await api.post("/products", productPayload);
      }

      setSuccessMessage("Product listed successfully!");
      setTimeout(() => {
        navigate("/explore");
      }, 1200);
    } catch (err) {
      console.error("Submission failed:", err);
      // If endpoint doesn't exist yet on backend, provide helpful notice
      if (err.response?.status === 404) {
        setSuccessMessage("Image uploaded to Cloudinary successfully! (URL: " + cloudinaryUrl + ")");
      } else {
        setErrorMessage(
          err.response?.data?.message || "Failed to submit product details."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      {/* Hidden file input for file system upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Hidden file input with camera capture */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
      />

      <div className="add-product-box" style={{ maxWidth: "600px" }}>
        <div className="add-product-box-header">
          <p>Add image & details of the Product</p>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              borderRadius: "8px",
              padding: "10px 14px",
              margin: "12px 20px 0",
              fontSize: "14px",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              borderRadius: "8px",
              padding: "10px 14px",
              margin: "12px 20px 0",
              fontSize: "14px",
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="add-product-image-section">
          {/* Interactive Image Drop/Preview Area */}
          <div
            className="image-box"
            onClick={handleUploadClick}
            style={{
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              border: imageUploadSuccess ? "2px solid #10b981" : undefined,
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Product Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Camera size={60} />
            )}

            {/* Uploading Spinner Overlay */}
            {isUploadingImage && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  gap: "8px",
                }}
              >
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: "13px" }}>Uploading to Cloudinary...</span>
              </div>
            )}

            {/* Success Badge */}
            {imageUploadSuccess && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#10b981",
                  color: "white",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={14} />
                <span>Uploaded</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="image-box-button-section">
            <button
              type="button"
              className="image-box-take-image-button"
              onClick={handleCameraClick}
              disabled={isUploadingImage}
            >
              <div className="image-box-take-image-button-container">
                <Camera size={20} />
                <span>Take Image</span>
              </div>
            </button>

            <button
              type="button"
              className="image-box-upload-image-button"
              onClick={handleUploadClick}
              disabled={isUploadingImage}
            >
              <div className="image-box-upload-image-button-container">
                <Upload size={20} />
                <span>Upload Image</span>
              </div>
            </button>
          </div>

          {/* Product Details Form */}
          <form
            onSubmit={handleProductSubmit}
            style={{ width: "100%", marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                Product Title
              </label>
              <input
                type="text"
                placeholder="e.g. Handcrafted Terracotta Tea Set"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="1"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Pottery">Pottery</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Woodcraft">Woodcraft</option>
                  <option value="Metal Crafts">Metal Crafts</option>
                  <option value="Home Decor">Home Decor</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingAI}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#b45309",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {isGeneratingAI ? (
                    <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  Auto-write with Gemini AI
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Describe the artisan craft, materials, and heritage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Continue / Submit Product Button */}
            <button
              type="submit"
              className="continue-button"
              disabled={isSubmitting || isUploadingImage || !cloudinaryUrl}
              style={{
                marginTop: "10px",
                opacity: !cloudinaryUrl || isSubmitting ? 0.7 : 1,
                cursor: !cloudinaryUrl || isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              <div className="continue-button-content">
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                    <span>Publishing Product...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & List Product</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;