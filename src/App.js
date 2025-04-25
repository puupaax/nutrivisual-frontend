import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/detect/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(response.data);
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim gambar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      {/* Header */}
      <header className="w-full flex justify-center items-center px-12 py-6 bg-white shadow-sm fixed top-0 left-0 z-10">
        <nav className="flex gap-20 text-gray-700 font-medium">
          <a href="#visualisasi" className="hover:text-[#2f855a]">Visualisasi</a>
          <a href="#teknologi" className="hover:text-[#2f855a]">Teknologi</a>
          <a href="#referensi" className="hover:text-[#2f855a]">Referensi</a>
        </nav>
      </header>


      {/* Main Section */}
      <main className="pt-32 px-8 max-w-7xl mx-auto space-y-10">
        {/* Top Section: Title + Upload side-by-side */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Title and Text */}
          <div className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2f855a] leading-tight">
              NutriVisual,
              <br />
              <span className="text-gray-900">Pahami isi di balik label gizi!</span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Visualisasi tabel gizi Produk Kemasanmu yang mau kamu beli dengan Deteksi Objek dan Pengenalan Karakter.
            </p>
            <p className="mt-4 text-gray-600 text-sm">
              <strong>Kesulitan dalam membaca tabel gizi pada produk kemasan? </strong>
               Upload gambar tabel informasi nilai gizi produk yang mau kamu beli untuk mengetahui seberapa besar kandungan gizi didalamnya menggunakan pendekatan yang sederhana dan mudah dipahami!. 
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow-xl rounded-2xl p-4">
                <p className="text-[#2f855a] mt-0 mb-0 text-sm text-center "> Visualisasi menggunakan istilah dan takaran yang digunakan sehari-hari.</p>
              </div>

              <div className="bg-white shadow-xl rounded-2xl p-4">
                <p className="text-[#2f855a] mt-0 mb-0 text-sm text-center ">Visualisasi menggunakan bahan makanan setara.</p>
              </div>

              <div className="bg-white shadow-xl rounded-2xl p-4">
                <p className="text-[#2f855a] mt-0 mb-0 text-sm text-center ">Perbandingan dengan anjuran/batas konsumsi harian.</p>
              </div>
            </div>
          </div>

          {/* Upload Box */}
          <div className="lg:w-1/2 bg-white shadow-xl rounded-2xl p-8 ">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`w-full h-64  border-2 border-dashed rounded-xl flex flex-col justify-center items-center cursor-pointer transition ${
                  isDragActive ? "border-yellow-300 bg-yellow-100 text-black" : "border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full object-contain rounded-md"
                  />
                ) : (
                  <>
                    <div className="bg-[#2f855a] text-white px-6 py-2 rounded-full font-semibold">
                      Upload Gambar
                    </div>
                    <span className="mt-2 text-sm text-gray-500">atau tarik ke sini</span>
                  </>
                )}
              </div>

              {/* Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-full text-gray-700" defaultValue="">
                  <option value="" disabled>Jenis Kelamin</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>

                <select className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-full text-gray-700" defaultValue="">
                  <option value="" disabled>Range Usia</option>
                  <option value="0-5">0–5 tahun</option>
                  <option value="6-12">6–12 tahun</option>
                  <option value="13-18">13–18 tahun</option>
                  <option value="19-59">19–59 tahun</option>
                  <option value="60+">60+ tahun</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#2f855a] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#276749] w-full"
              >
                Kirim
              </button>
            </form>
            {loading && <p className="italic text-gray-600 text-center">Memproses gambar...</p>}
          </div>
        </div>

        <div className="w-full bg-[#f4ecd8] p-8">
          <h3 className="text-xl font-bold text-[#2f855a] mb-4">Hasil Visualisasi</h3>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Box - Hasil Deteksi */}
            <div className="lg:w-1/2 w-full bg-white shadow-xl rounded-2xl p-6">
              {loading && <p className="italic text-gray-600">Memproses gambar...</p>}
              {results ? (
                <ul className="list-disc ml-6 space-y-1">
                  {Object.entries(results).map(([label, value]) => (
                    <li key={label}>
                      <strong>{label}</strong>: {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Hasil akan ditampilkan disini….</p>
              )}
            </div>

            {/* Right Box - Comparison */}
            <div className="lg:w-1/2 w-full bg-white shadow-xl rounded-2xl p-6">
              {/* Comparison content goes here */}
              <p className="text-gray-500 italic">Hasil akan ditampilkan disini….</p>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}

export default App;
