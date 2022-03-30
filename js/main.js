const gallery_content = document.querySelector('.gallery__content');
const imgElement = document.querySelector('#js-editor__img');

function initHandlers() {
    initDragDropHandlers();
    initFormHandlers();
}

/** 
 * Javascript Related to Drag and Drop Events
 * 
 * These functions how dragging and dropping entities functions on the gallery.
 * */
function initDragDropHandlers() {
    const dropHandle = document.getElementById('gallery');
    dropHandle.addEventListener("dragenter", dragenter, false);
    dropHandle.addEventListener("dragover", dragover, false);
    dropHandle.addEventListener("drop", drop, false);
    dropHandle.addEventListener("dragleave", dragleave, false);

}

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
    gallery_content.style.borderColor = 'rgba(0, 91, 117, 0.6)';
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;
    gallery_content.style.borderColor = 'rgba(130, 134, 136, 0.2)';
    handleFiles(files);
}

function dragleave(e){
    e.stopPropagation();
    e.preventDefault();

    gallery_content.style.borderColor = 'rgba(130, 134, 136, 0.2)';
}

function colorSelected(parentElement, selectedIndex, className){
    console.log('selectedIndex: ' + selectedIndex);

    if(parentElement && selectedIndex >= 0){
        console.log(parentElement.children[selectedIndex]);
        parentElement.children[selectedIndex].classList.add(className);
        for(let i = 0; i < parentElement.children.length; i++){
            if(i != selectedIndex){
                if(parentElement.children[i].classList.contains(className)){
                    parentElement.children[i].classList.remove(className);
                    console.log('removed index' + selectedIndex);
                }
            }
        }
    }
}

function handleFiles(files) { //images[]
    const fileName = document.getElementById('js-metadata__name')
    const mimeTypeText = document.getElementById('js-metadata__mime');
    const fileSizeText = document.getElementById('js-metadata__size');
    const className = 'selected-thumb';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const placeholderText = document.getElementById('js-gallery__placeholder'); // Uses the js- prefix as a handle
        placeholderText.style.display= "none";

        const img = document.createElement("img");
        img.classList.add('js-gallery__thumbnail');
        img.classList.add('gallery__thumbnail');
        img.file = file;
        img.addEventListener('click', (e) => { // Gallery image click handler
            const reader = new FileReader();
            reader.onload = (e) => { 
                document.getElementById('js-editor__img').src = e.target.result; 
                fileName.innerHTML = file.name;
                mimeTypeText.innerHTML = file.type;
                fileSizeText.innerHTML = humanizeFileSize(file.size);
                const placeholderText = document.getElementById('js-editor__placeholder'); // Uses the js- prefix as a handle
                placeholderText.style.display= "none";
                colorSelected(img.parentElement, i+1, className);    
            };
            
            reader.readAsDataURL(file);
        })
        const galleryContentElement = document.getElementById('js-gallery__content');
        galleryContentElement.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
        galleryContentElement.classList.add('flex-center--left');

        // Create a new FileReader and assign the image's source as 
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target.result; 
        reader.readAsDataURL(file);
    }
}

/** 
 * Javascript Related to Form Handling
 * 
 * These functions control the adding/removing of CSS transforms to the image in the editor pane
 * They are called by actions performed on the sidebar 
 * */
function initFormHandlers() {
    document.getElementById('clip').addEventListener('click', (e) => changeShape(e.target));
    document.getElementById('filter').addEventListener('click', (e) => changeFilter(e.target));
}

function hasPrefix(className, classList){
    for(let i = 0; i < classList.length; i++){
        if(classList[i].toString().includes(className)){
            return true;
        }
    }

    return false;
}

function changeShape(clipChoice) {
    const parentElementArr = clipChoice.parentElement.children;
    const parentElement = clipChoice.parentElement;

    if(imgElement.hasAttribute('class')){
        if(hasPrefix('clip', imgElement.classList)){
            for(let i = 0; i < parentElementArr.length; i++){
                if(imgElement.classList.contains(parentElementArr[i].dataset.clip)){
                    imgElement.classList.remove(parentElementArr[i].dataset.clip);
                    imgElement.classList.add(clipChoice.dataset.clip);
                }
            }
        }
        else{
            imgElement.classList.add(clipChoice.dataset.clip);
        }
    }
    else{
        console.log('initial clip');
        imgElement.classList.add(clipChoice.dataset.clip);
    }
    
    colorSelected(parentElement, [].indexOf.call(parentElementArr, clipChoice),'selected');
    // console.log([].indexOf.call(parentElementArr, clipChoice));
}

function changeFilter(filterChoice) {
    const parentElementArr = filterChoice.parentElement.children;
    const parentElement = filterChoice.parentElement;
    console.log(filterChoice.dataset.filter);
    
    if(imgElement.hasAttribute('class')){    
        if(hasPrefix('filter', imgElement.classList)){
            for(let i = 0; i < parentElementArr.length; i++){
                if(imgElement.classList.contains(parentElementArr[i].dataset.filter)){
                    imgElement.classList.remove(parentElementArr[i].dataset.filter);
                    imgElement.classList.add(filterChoice.dataset.filter);
                }
            }
        }
        else{
            imgElement.classList.add(filterChoice.dataset.filter);
        }
    }
    else{
        console.log('initial filter');
        imgElement.classList.add(filterChoice.dataset.filter);
    }   

    colorSelected(parentElement, [].indexOf.call(parentElementArr, filterChoice),'selected');
}

// Use this function to display filesize in a human-readable format
function humanizeFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si 
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

// Wait for the window to finish loading before executing our Javascript
window.onload = (event) => {
    initHandlers();
}; 