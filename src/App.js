import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useEffect } from 'react';


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function App() {

  useEffect(() => {
    fetch('https://fastapi-production-fbed.up.railway.app/health/')
      .then(res=>console.log('success: ', res.status))
      .catch(err=> console.error('gagal', err))
    document.body.classList.add('scroll-smooth');
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false); 

  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState(""); 
  const [ageRange, setAgeRange] = useState(""); 
  const [visualType, setVisualType] = useState(""); 

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": ['.jpeg', '.jpg', '.png', '.heic', '.heif'] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    },
  });

  const handleGenderChange = (e) => setGender(e.target.value); 
  const handleAgeRangeChange = (e) => setAgeRange(e.target.value); 
  const handleVisualTypeChange = (e) => setVisualType(e.target.value); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("gender", gender); 
    formData.append("age_range", ageRange); 
    formData.append("tipe_visualisasi", visualType); 

    try {
      setLoading(true);
      const response = await axios.post("https://fastapi-production-fbed.up.railway.app/detect/", formData, {
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

  const chartData = [
    {
      name: "Energi Total",
      nilai: results?.data?.energi_total ?? 0,
      batas: results?.data?.batas_energi_total ?? 0,
    },
    {
      name: "Garam",
      nilai: results?.data?.garam ?? 0,
      batas: results?.data?.batas_garam ?? 0,
    },
    {
      name: "Gula",
      nilai: results?.data?.gula ?? 0,
      batas: results?.data?.batas_gula ?? 0,
    },
    {
      name: "Karbohidrat",
      nilai: results?.data?.karbohidrat_total ?? 0,
      batas: results?.data?.batas_karbohidrat_total ?? 0,
    },
    {
      name: "Lemak Total",
      nilai: results?.data?.lemak_total ?? 0,
      batas: results?.data?.batas_lemak_total ?? 0,
    },
    {
      name: "Lemak Jenuh",
      nilai: results?.data?.lemak_jenuh ?? 0,
      batas: results?.data?.batas_lemak_jenuh ?? 0,
    },
    {
      name: "Protein",
      nilai: results?.data?.protein ?? 0,
      batas: results?.data?.batas_protein ?? 0,
    },
  ];

  const giziList = [
    { label: "Total Kalori", value: results?.data?.energi_total, batas: results?.data?.batas_energi_total },
    { label: "Garam", value: results?.data?.garam, batas: results?.data?.batas_garam },
    { label: "Gula", value: results?.data?.gula, batas: results?.data?.batas_gula },
    { label: "Karbohidrat Total", value: results?.data?.karbohidrat_total, batas: results?.data?.batas_karbohidrat_total },
    { label: "Lemak Jenuh", value: results?.data?.lemak_jenuh, batas: results?.data?.batas_lemak_jenuh },
    { label: "Lemak Total", value: results?.data?.lemak_total, batas: results?.data?.batas_lemak_total },
    { label: "Protein", value: results?.data?.protein, batas: results?.data?.batas_protein },
  ];

  const openModal = () => setIsModalOpen(true); // Open modal 
  const closeModal = () => setIsModalOpen(false); // Close modal 

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      {/* Header */}
      <header className="w-full flex justify-center items-center px-12 py-6 bg-white shadow-sm fixed top-0 left-0 z-10">
        <nav className="flex gap-10 text-gray-700 font-medium">
          <a href="#visualisasi" className="hover:text-[#2f855a]">Visualisasi</a>
          <a href="#teknologi" className="hover:text-[#2f855a]">Teknologi</a>
          <a href="#referensi" className="hover:text-[#2f855a]">Referensi</a>
        </nav>
      </header>

      {/* Main Section */}
      <section id="visualisasi">
      <main className="pt-32 px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Top Section: Title + Upload side-by-side */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Title and Text */}
          <div className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2f855a] leading-tight">
              NutriVisual,
              <br />
              <span className="text-gray-900">Pahami isi di balik tabel informasi gizi!</span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Visualisasi tabel gizi Produk Kemasan yang mau kamu beli dengan Deteksi Objek dan Pengenalan Karakter.
            </p>
            <p className="mt-4 text-gray-600 text-sm">
              <strong>Kesulitan dalam membaca tabel gizi pada produk kemasan? </strong>
               Upload gambar tabel informasi nilai gizi produk yang mau kamu beli untuk mengetahui seberapa besar kandungan gizi didalamnya menggunakan pendekatan yang sederhana dan mudah dipahami!. 
            </p>
            <div className="mt-8 flex flex-col sm:flex-row text-[#2f855a] text-sm text-center">
              <div className="flex-1 flex items-center justify-center px-4 py-6">
                <p>Visualisasi menggunakan istilah dan takaran yang digunakan sehari-hari.</p>
              </div>

              <div className="flex-1 flex items-center justify-center px-4 py-6 border-t sm:border-t-0 sm:border-l border-gray-300">
                <p>Visualisasi menggunakan bahan makanan setara.</p>
              </div>

              <div className="flex-1 flex items-center justify-center px-4 py-6 border-t sm:border-t-0 sm:border-l border-gray-300">
                <p>Perbandingan dengan anjuran/batas konsumsi harian.</p>
              </div>
            </div>
          </div>

          {/* Upload Box */}
          <div className="lg:w-1/2 bg-white shadow-xl rounded-2xl p-8 ">
              {/* Help Icon and Modal Trigger */}
              <div className="relative group inline-flex items-center mb-3 ml-2">
                <p className="mr-2">Lihat panduan</p> {/* Add margin to the right of the text */}
                <img
                  src="/asset/question-icon.png"
                  alt="Help"
                  className="w-6 h-6 cursor-pointer"
                  onClick={openModal} // Open modal when clicked
                />
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl relative">
                    <img
                      src="/asset/guide.png"
                      alt="Guide"
                      className="w-full h-auto rounded-lg"
                    />
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 text-gray-700 text-3xl"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col justify-center items-center cursor-pointer transition ${
                  isDragActive ? "border-yellow-300 bg-yellow-100 text-black" : "border-gray-400"
                }`}
              >
                <input {...getInputProps()} required={!selectedFile} />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full object-contain rounded-md"
                  />
                ) : (
                  <>
                    {/* Upload Button */}
                    <div className="bg-[#2f855a] text-white px-6 py-2 rounded-full font-semibold">
                      Upload foto tabel
                    </div>
                    <span className="mt-2 text-sm text-gray-500">atau tarik ke sini</span>
                  </>
                )}
              </div>

              {/* kamera */}
              
                <>
                  <label
                    htmlFor="cameraInput"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm cursor-pointer self-center font-semibold"
                  >
                    Foto dengan kamera
                  </label>
                  <input
                    id="cameraInput"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setPreview(reader.result);
                        reader.readAsDataURL(file);
                        setSelectedFile(file); 
                        setCapturedFile(file);
                      }
                    }}
                  />
                </>
              

              {/* Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-full text-gray-700"
                  value={gender}
                  onChange={handleGenderChange}
                  required
                >
                  <option value="" disabled>Jenis Kelamin</option>
                  <option value="laki_laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>

                <select
                  className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-full text-gray-700"
                  value={ageRange}
                  onChange={handleAgeRangeChange}
                  required
                >
                  <option value="" disabled>Range Usia</option>
                  <option value="10_12_tahun">10–12 tahun</option>
                  <option value="13_15_tahun">13–15 tahun</option>
                  <option value="16_18_tahun">16–18 tahun</option>
                  <option value="19_29_tahun">19–29 tahun</option>
                  <option value="30_49_tahun">30–49 tahun</option>
                  <option value="50_64_tahun">50–64 tahun</option>
                  <option value="65_80_tahun">65–80 tahun</option>
                  <option value="80_plus_tahun">80+ tahun</option>
                </select>

                <select
                  className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-full text-gray-700"
                  value={visualType}
                  onChange={handleVisualTypeChange}
                  required
                >
                  <option value="" disabled>Tipe Visualisasi</option>
                  <option value="kemasan">per 1 Kemasan</option>
                  <option value="sajian">per 1 Sajian</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#2f855a] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#276749] w-full"
              >
                Deteksi
              </button>
            </form>

            {/* Loading Text */}
            {loading && <p className="italic text-gray-600 text-center">Memproses gambar...</p>}

          </div>
        </div>

        {/* Hasil Visualisasi */}
        <div className="w-full bg-[#f4ecd8] p-8">
          <h3 className="text-xl font-bold text-[#2f855a] mb-4">Hasil Visualisasi</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {[
              { label: 'Sajian per Kemasan', value: results?.data?.sajian_per_kemasan ?? 0, unit: 'sajian' },
              { label: 'Energi Total', value: results?.data?.energi_total ?? 0, unit: 'kkal' },
              { label: 'Lemak Total', value: results?.data?.lemak_total ?? 0, unit: 'gram' },
              { label: 'Lemak Jenuh', value: results?.data?.lemak_jenuh ?? 0, unit: 'gram' },
              { label: 'Protein', value: results?.data?.protein ?? 0, unit: 'gram' },
              { label: 'Karbohidrat', value: results?.data?.karbohidrat_total ?? 0, unit: 'gram' },
              { label: 'Gula', value: results?.data?.gula ?? 0, unit: 'gram' },
              { label: 'Garam', value: results?.data?.garam ?? 0, unit: 'miligram' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-xl w-full aspect-square flex flex-col justify-center items-center p-2"
              >
                <p className="text-gray-500 text-xs sm:text-sm text-center">{item.label}</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-500 leading-tight text-center">
                  {item.value}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm text-center">{item.unit}</p>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Box - Hasil Deteksi */}
            <div className="lg:w-1/2 w-full bg-white shadow-xl rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#8884d8] rounded-sm" />
                  <span>Nilai Gizi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#2f855a] rounded-sm" />
                  <span>Batas Harian</span>
                </div>
              </div>
              {chartData.map((data, index) => (
                <div key={index} className="mb-5">
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={[data]} layout="vertical">
                      <Bar dataKey="nilai" fill="#8884d8">
                        <LabelList dataKey="nilai" position="insideRight" fill="#fff" />
                      </Bar>
                      <Bar dataKey="batas" fill="#2f855a">
                        <LabelList dataKey="batas" position="insideRight" fill="#fff" />
                      </Bar>
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={85} />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>

            {/* Comparison */}
            <div className="lg:w-1/2 w-full flex flex-col gap-4">
              {/* Box Atas (25%) */}
              <div className="flex-1 bg-white shadow-xl rounded-2xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {giziList.map((item, index) => {
                    let status = "";
                    let bgColor = "";

                    if (item.value > item.batas) {
                      status = "Sebaiknya dihindari atau dikurangi.";
                      bgColor = "#A41C1C";
                    } else if (item.value > item.batas / 2 && item.value <= item.batas) {
                      status = "Hindari konsumsi berlebihan";
                      bgColor = "#FE7743";
                    } else if (item.value <= item.batas / 2) {
                      status = "Tetap konsumsi dalam batas aman";
                      bgColor = "#2f855a";
                    } else {
                      status = "-";
                      bgColor = "#E4E3DF";
                    }

                    return (
                      <div 
                        key={index}
                        className="flex flex-col justify-between p-4 text-white rounded-md text-sm shadow"
                        style={{ backgroundColor: bgColor, height: '100%' }} // Tambahin height 100%
                      >
                        <h3 className="font-semibold text-sm mb-2">
                          {item.label}: {((item.value / item.batas) * 100).toFixed(1)}% dari batas harian
                        </h3>
                        <p className="text-xs mt-auto">Tips: {status}</p>
                      </div>
                    );
                  })}
                </div>
                {/* Ini bagian perhatian */}
                <p className="text-xs text-gray-600 mt-6">
                  <strong>Perhatian:</strong> Asupan harian berasal dari berbagai sumber makanan, bukan hanya ini.
                </p>
              </div>

              
              {/* Box Bawah (75%) */}
              <div className="flex-[3] bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-start">
                <div className="flex flex-col md:flex-row w-full relative">
                  
                  {/* Kolom Kiri */}
                  <div className="w-full md:w-1/2 flex flex-col items-center text-gray-600 text-sm px-4">
                    <h2 className="font-bold mb-2">Kalori setara dengan:</h2>
                    <p className="text-center">{results?.perbandingan_kalori?.nama ?? '-'}</p>
                    <p>Nilai Kalori: {results?.perbandingan_kalori?.nilai_kalori ?? 0} kkal</p>
                    {results?.perbandingan_kalori?.path && (
                      <img
                        src={results.perbandingan_kalori.path}
                        alt=""
                        className="w-24 h-24 object-cover rounded-md mt-2"
                      />
                    )}
                  </div>

                  {/* Garis Tengah */}
                  <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300" />

                  {/* Kolom Kanan */}
                  <div className="w-full md:w-1/2 flex flex-col items-center text-gray-600 text-sm px-4 mt-6 md:mt-0">
                    <h2 className="font-bold mb-2">Protein setara dengan:</h2>
                    <p className="text-center">{results?.perbandingan_protein?.nama ?? '-'}</p>
                    <p>Nilai Protein: {results?.perbandingan_protein?.nilai_protein ?? 0} g</p>
                    {results?.perbandingan_protein?.path && (
                      <img
                        src={results.perbandingan_protein.path}
                        alt=""
                        className="w-24 h-24 object-cover rounded-md mt-2"
                      />
                    )}
                  </div>

                </div>

                {/* Baris Bawah */}
                <div className="flex flex-col md:flex-row w-full relative mt-6">
                  
                  {/* Kolom Kiri */}
                  <div className="w-full md:w-1/2 flex flex-col items-center text-gray-600 text-sm px-4">
                    <h2 className="font-bold mb-2 text-center">Karbohidrat setara dengan:</h2>
                    <p className="text-center">
                    {results?.data?.karbohidrat_total ? (() => {
                      const jumlahPorsi = results.data.karbohidrat_total / 42;
                      const integerPart = Math.floor(jumlahPorsi);
                      const fractionalPart = jumlahPorsi - integerPart;
                      let hasil = '';
                      if (fractionalPart < 0.2) {
                        hasil = `${integerPart}`;
                      } else if (fractionalPart >= 0.2 && fractionalPart < 0.4) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¼`;
                      } else if (fractionalPart >= 0.4 && fractionalPart < 0.6) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}½`;
                      } else if (fractionalPart >= 0.6 && fractionalPart < 0.8) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¾`;
                      } else {
                        hasil = `${integerPart + 1}`;
                      }
                      return hasil ? `${hasil} Porsi nasi putih` : '-';
                    })() : '-'}
                    </p>
                    {results?.perbandingan_kalori?.path && (
                      <img
                        src="/asset/nasi putih.jpeg"
                        alt=""
                        className="w-24 h-24 object-cover rounded-md mt-2"
                      />
                    )}
                  </div>

                  {/* Garis Tengah */}
                  <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300" />

                  {/* Kolom Kanan*/}
                  <div className="w-full md:w-1/2 flex flex-col items-center text-gray-600 text-sm px-4 mt-6 md:mt-0">
                    <h2 className="font-bold mb-1 text-center">Gula setara dengan:</h2>
                    <p className="text-center mb-2">
                    {results?.data?.gula ? (() => {
                      const jumlahSendok = results.data.gula / 12.5;
                      const integerPart = Math.floor(jumlahSendok);
                      const fractionalPart = jumlahSendok - integerPart;
                      let hasil = '';
                      if (fractionalPart < 0.2) {
                        hasil = `${integerPart}`;
                      } else if (fractionalPart >= 0.2 && fractionalPart < 0.4) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¼`;
                      } else if (fractionalPart >= 0.4 && fractionalPart < 0.6) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}½`;
                      } else if (fractionalPart >= 0.6 && fractionalPart < 0.8) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¾`;
                      } else {
                        hasil = `${integerPart + 1}`;
                      }
                      return hasil ? `${hasil} sendok makan` : '-';
                    })() : '-'}
                    </p>
                    <h2 className="font-bold mb-1 text-center">Garam setara dengan:</h2>
                    <p className="text-center mb-2">
                    {results?.data?.garam ? (() => {
                      const jumlahSendok = results.data.garam / 2000;
                      const integerPart = Math.floor(jumlahSendok);
                      const fractionalPart = jumlahSendok - integerPart;

                      let hasil = '';

                      if (fractionalPart < 0.2) {
                        hasil = `${integerPart}`;
                      } else if (fractionalPart >= 0.2 && fractionalPart < 0.4) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¼`;
                      } else if (fractionalPart >= 0.4 && fractionalPart < 0.6) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}½`;
                      } else if (fractionalPart >= 0.6 && fractionalPart < 0.8) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¾`;
                      } else {
                        hasil = `${integerPart + 1}`;
                      }

                      return hasil ? `${hasil} sendok teh` : '-';
                    })() : '-'}
                    </p>
                    <h2 className="font-bold mb-1 text-center">Lemak Total setara dengan:</h2>
                    <p className="text-center mb-2">
                    {results?.data?.lemak_total ? (() => {
                      const jumlahSendok = results.data.lemak_total / 13.4;
                      const integerPart = Math.floor(jumlahSendok);
                      const fractionalPart = jumlahSendok - integerPart;

                      let hasil = '';

                      if (fractionalPart < 0.2) {
                        hasil = `${integerPart}`;
                      } else if (fractionalPart >= 0.2 && fractionalPart < 0.4) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¼`;
                      } else if (fractionalPart >= 0.4 && fractionalPart < 0.6) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}½`;
                      } else if (fractionalPart >= 0.6 && fractionalPart < 0.8) {
                        hasil = `${integerPart > 0 ? integerPart + ' ' : ''}¾`;
                      } else {
                        hasil = `${integerPart + 1}`;
                      }

                      return hasil ? `${hasil} sendok makan` : '-';
                    })() : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section id="teknologi" className="h-1 invisible"></section>
        {/*area teknologi yg digunakan*/}
        <section id="konten teknologi" className="w-full bg-gradient-to-l from-[#f4ecd8] to-white py-16 px-8">
          <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
              {/* logo */}
              <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col lg:flex-row items-center justify-center">
              <div className="flex-1 flex items-center justify-center px-4 py-6 mb-4 lg:mb-0 lg:mr-4">
                <img
                  src="/asset/logo yolo.jpeg"
                  alt="YOLO Logo"
                  className="h-32 object-contain transition-transform hover:scale-110"
                />
              </div>

              <div className="flex-1 flex items-center justify-center px-4 py-6 lg:border-l lg:border-t-0 border-t border-gray-300">
                <img
                  src="/asset/logo ocr.jpg"
                  alt="EasyOCR Logo"
                  className="h-32 object-contain transition-transform hover:scale-110"
                />
              </div>
            </div>
            {/* Title dan Text */}
            <div className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-[#2f855a]">Teknologi</span><br />
                <span className="text-gray-900">yang digunakan.</span>
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                <strong>YOLOv10. </strong>
                You Only Look Once (YOLO) merupakan pre-trained model yang menghadirkan pendekatan real-time end-to-end untuk deteksi objek.
                Dalam aplikasi ini model YOLOv10 digunakan untuk mendeteksi keberadaan tabel informasi nilai gizi yang sudah di upload, lalu juga mendeteksi
                masing-masing nilai gizi yang ada yang selanjutnya akan di proses menggunakan easyOCR.
              </p>
              <p className="mt-4 text-gray-600 text-lg">
                <strong>EasyOCR. </strong>
                Optical Character Recognition (OCR) adalah proses mengubah teks cetak menjadi format digital yang dapat dibaca oleh komputer,
                OCR menganalisis gambar untuk mengidentifikasikan karakter, kata, ataupun blok teks satu per satu. Dalam aplikasi ini, easyOCR digunakan
                untuk melakukan ekstraksi data gizi yang sudah di deteksi sebelumnya, hasil ekstraksi nantinya akan diterapkan aturan untuk mengambil hanya bagian
                nilai gizinya saja, sehingga data dapat di proses ke tahap selanjutnya yaitu visualisasi.
              </p>
            </div>
          </div>
        </section>
        <section id="referensi" className="h-1 invisible"></section>

        {/*area referensi*/}
        <section id="konten referensi" className="w-full bg-gradient-to-r from-[#f4ecd8] to-white py-16 px-8">
          <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
            {/* Title dan Text */}
            <div className="lg:w-1/2 text-center lg:text-left flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-[#2f855a]">Referensi</span><br />
                <span className="text-gray-900">yang digunakan.</span>
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                <strong>Takaran saji. </strong>
                Satu sendok makan gula setara dengan 12,5 gram, satu sendok teh garam setara dengan 2000 mg, dan satu sendok makan lemak setara dengan 13,4 gram. 
                Takaran ini digunakan untuk memudahkan pemahaman jumlah kandungan dalam makanan berdasarkan ukuran rumah tangga sehari-hari.
              </p>
              <p className="mt-4 text-gray-600 text-lg">
                <strong>Kalori dan Protein dalam makanan/minuman. </strong>
                Referensi nilai kalori dan protein pada makanan/minuman diambil dari daftar konversi zat gizi berdasarkan hasil Susenas Maret 2024 oleh Badan Pusat Statistik.{" "}
                <a href="https://assets.dataindonesia.id/2025/01/23/1737605184791-81-23.-konsumsi-kalori-dan-protein-penduduk-indonesia-dan-provinsi--maret-2024.pdf#page=147" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  lihat disini
                </a>
              </p>
            </div>
            {/* logo */}
            <div className="lg:w-1/2 bg-white shadow-xl rounded-2xl p-8 ">
              <p className="mt-4 text-gray-600 text-lg text-center">
                <strong>Angka Kecukupan Gizi Harian.</strong>
              </p>
              <img
                src="/asset/akg.png"
                alt="akg"
                className="h-100 object-contain mt-4 transition-transform hover:scale-110"
              />
            </div>
          </div>
        </section>
      </main>
      </section>
      <footer className="w-full flex flex-col items-center justify-center px-12 py-6 bg-[#2f855a] shadow-inner mt-10">
        <img
          src="/asset/Nutri.png"
          alt="logo web"
          className="h-16 object-contain transition-transform hover:scale-110"
        />
      </footer>
    </div>
  );
}
export default App;
