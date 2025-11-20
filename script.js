// State Management
const state = {
    genero: 'masculino',
    nome: '',
    numero: '',
    clube: '',
    logoBase64: '',
    logoMimeType: '',
    aspectRatio: '9:16',
    currentImageData: null
};

// DOM Elements
const els = {
    btnRatio916: document.getElementById('btn-ratio-9-16'),
    btnRatio169: document.getElementById('btn-ratio-16-9'),
    btnGenderMasc: document.getElementById('btn-gender-masc'),
    btnGenderFem: document.getElementById('btn-gender-fem'),
    inputClube: document.getElementById('input-clube'),
    inputNome: document.getElementById('input-nome'),
    inputNumero: document.getElementById('input-numero'),
    uploadArea: document.getElementById('upload-area'),
    previewArea: document.getElementById('preview-area'),
    logoPreviewImg: document.getElementById('logo-preview-img'),
    btnClearLogo: document.getElementById('btn-clear-logo'),
    inputFile: document.getElementById('input-file'),
    btnGenerate: document.getElementById('btn-generate'),
    btnText: document.getElementById('btn-text'),
    btnLoading: document.getElementById('btn-loading'),
    btnShine: document.getElementById('btn-shine'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    previewContainer: document.getElementById('preview-container'),
    loadingOverlay: document.getElementById('loading-overlay'),
    emptyState: document.getElementById('empty-state'),
    generatedImage: document.getElementById('generated-image'),
    imageActions: document.getElementById('image-actions'),
    btnDownload: document.getElementById('btn-download'),
    editorSection: document.getElementById('editor-section'),
    editForm: document.getElementById('edit-form'),
    inputEdit: document.getElementById('input-edit'),
    tipsSection: document.getElementById('tips-section')
};

// Initialize Icons
lucide.createIcons();

// --- Event Listeners ---

// Ratio Switching
els.btnRatio916.addEventListener('click', () => setRatio('9:16'));
els.btnRatio169.addEventListener('click', () => setRatio('16:9'));

// Gender Switching
els.btnGenderMasc.addEventListener('click', () => setGender('masculino'));
els.btnGenderFem.addEventListener('click', () => setGender('feminino'));

// Text Inputs
els.inputClube.addEventListener('input', (e) => { state.clube = e.target.value; validateForm(); });
els.inputNome.addEventListener('input', (e) => { state.nome = e.target.value; validateForm(); });
els.inputNumero.addEventListener('input', (e) => { state.numero = e.target.value; validateForm(); });

// File Upload
els.uploadArea.addEventListener('click', () => els.inputFile.click());
els.inputFile.addEventListener('change', handleFileSelect);
els.btnClearLogo.addEventListener('click', clearLogo);

// Actions
els.btnGenerate.addEventListener('click', generateWallpaper);
els.btnDownload.addEventListener('click', downloadImage);
els.editForm.addEventListener('submit', editWallpaper);

// --- Logic ---

function setRatio(ratio) {
    state.aspectRatio = ratio;
    
    // Update Buttons
    if (ratio === '9:16') {
        els.btnRatio916.className = 'ratio-btn relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 bg-emerald-500/10 border-emerald-500 text-emerald-400';
        els.btnRatio169.className = 'ratio-btn relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 bg-black/20 border-transparent hover:bg-black/40 hover:border-white/10 text-slate-500';
        
        // Update Preview Container
        els.previewContainer.className = 'relative w-full max-w-[380px] aspect-[9/16] bg-black/40 rounded-3xl p-2 border border-white/10 shadow-2xl transition-all duration-500';
        els.editorSection.classList.add('max-w-[380px]');
        els.editorSection.classList.remove('w-full');
    } else {
        els.btnRatio169.className = 'ratio-btn relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 bg-emerald-500/10 border-emerald-500 text-emerald-400';
        els.btnRatio916.className = 'ratio-btn relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 bg-black/20 border-transparent hover:bg-black/40 hover:border-white/10 text-slate-500';
        
        // Update Preview Container
        els.previewContainer.className = 'relative w-full aspect-video bg-black/40 rounded-3xl p-2 border border-white/10 shadow-2xl transition-all duration-500';
        els.editorSection.classList.remove('max-w-[380px]');
        els.editorSection.classList.add('w-full');
    }
}

function setGender(gender) {
    state.genero = gender;
    if (gender === 'masculino') {
        els.btnGenderMasc.classList.replace('text-slate-500', 'bg-slate-700');
        els.btnGenderMasc.classList.replace('hover:text-slate-300', 'text-white');
        els.btnGenderMasc.classList.add('shadow-lg');
        
        els.btnGenderFem.classList.replace('bg-slate-700', 'text-slate-500');
        els.btnGenderFem.classList.replace('text-white', 'hover:text-slate-300');
        els.btnGenderFem.classList.remove('shadow-lg');
    } else {
        els.btnGenderFem.classList.replace('text-slate-500', 'bg-slate-700');
        els.btnGenderFem.classList.replace('hover:text-slate-300', 'text-white');
        els.btnGenderFem.classList.add('shadow-lg');
        
        els.btnGenderMasc.classList.replace('bg-slate-700', 'text-slate-500');
        els.btnGenderMasc.classList.replace('text-white', 'hover:text-slate-300');
        els.btnGenderMasc.classList.remove('shadow-lg');
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert("O arquivo deve ter no máximo 5MB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            state.logoBase64 = result.split(',')[1];
            state.logoMimeType = file.type;
            
            // Update UI
            els.logoPreviewImg.src = result;
            els.uploadArea.classList.add('hidden');
            els.previewArea.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function clearLogo(e) {
    if(e) e.stopPropagation();
    state.logoBase64 = '';
    state.logoMimeType = '';
    els.inputFile.value = '';
    els.uploadArea.classList.remove('hidden');
    els.previewArea.classList.add('hidden');
}

function validateForm() {
    const isValid = state.clube && state.nome && state.numero;
    if (isValid) {
        els.btnGenerate.disabled = false;
        els.btnGenerate.classList.replace('bg-slate-800', 'bg-gradient-to-r');
        els.btnGenerate.classList.replace('text-slate-600', 'text-white');
        els.btnGenerate.classList.replace('cursor-not-allowed', 'cursor-pointer');
        els.btnGenerate.classList.remove('opacity-50');
        els.btnGenerate.classList.add('from-emerald-500', 'to-teal-600', 'shadow-[0_0_30px_rgba(16,185,129,0.3)]', 'hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]', 'hover:scale-[1.01]');
        els.btnShine.classList.remove('hidden');
    } else {
        els.btnGenerate.disabled = true;
        els.btnGenerate.className = 'group w-full py-4 rounded-2xl font-jersey text-2xl tracking-wide transition-all relative overflow-hidden bg-slate-800 text-slate-600 cursor-not-allowed opacity-50';
        els.btnShine.classList.add('hidden');
    }
}

async function generateWallpaper() {
    setLoading(true);
    hideError();

    try {
        const response = await fetch('api/gerar-wallpaper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Erro na API');

        displayImage(data.image);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

async function editWallpaper(e) {
    e.preventDefault();
    const instruction = els.inputEdit.value.trim();
    if (!instruction || !state.currentImageData) return;

    setLoading(true);
    hideError();

    try {
        const response = await fetch('api/gerar-wallpaper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mode: 'edit',
                currentImage: state.currentImageData,
                instruction: instruction
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao editar');
        
        displayImage(data.image);
        els.inputEdit.value = '';

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

function displayImage(base64) {
    state.currentImageData = base64;
    els.generatedImage.src = `data:image/png;base64,${base64}`;
    els.generatedImage.classList.remove('hidden');
    els.emptyState.classList.add('hidden');
    els.imageActions.classList.remove('hidden');
    els.editorSection.classList.remove('hidden');
    els.tipsSection.classList.add('hidden');
}

function downloadImage() {
    if (!state.currentImageData) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${state.currentImageData}`;
    link.download = `futart-${state.clube.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
}

function setLoading(isLoading) {
    if (isLoading) {
        els.btnText.classList.add('hidden');
        els.btnLoading.classList.remove('hidden');
        els.loadingOverlay.classList.remove('hidden');
        els.btnGenerate.disabled = true;
    } else {
        els.btnText.classList.remove('hidden');
        els.btnLoading.classList.add('hidden');
        els.loadingOverlay.classList.add('hidden');
        validateForm(); // Re-enable button if form valid
    }
}

function showError(msg) {
    els.errorMessage.classList.remove('hidden');
    els.errorText.textContent = msg;
}

function hideError() {
    els.errorMessage.classList.add('hidden');
}