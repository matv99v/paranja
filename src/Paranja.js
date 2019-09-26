import {
  // getFromLocalStorage,
  // clearObject,
  restoreState,
  debounce,
  saveStateToLocalStorage,
} from './helpers';
import './Paranja.scss';


export default class Paranja {
  constructor() {
    const self = this;
    this.saveImagesLimit = 3;
    this.domElements = {};
    const debouncedSave = debounce(self.save, 1000);

    this.state = new Proxy({}, {
      get(target, prop) {
        return Reflect.get(target, prop);
      },
      set(target, prop, value) {
        self[`${prop}Cb`](value);
        debouncedSave();
        return Reflect.set(target, prop, value);
      },
    });

    this.createMarkup();
    this.initializeState();
    this.bindListeners();
  }

  createMarkup = () => {
    const paranja = document.createElement('div');
    paranja.classList.add('dev-helper__paranja');

    paranja.innerHTML = `
      <div class="dev-helper__img-box">
        <div class="dev-helper__img-wrapper">
          <img class="dev-helper__img">
        </div>
      </div>

      <section name="controls" class="dev-helper__controls">

          <input
            class="dev-helper-opacity-input"
            type="range"
            min="0"
            max="1"
            step="0.01"
            name="opacity"
          >

          <section class="dev-helper-move">
              <button
                type="button"
                data-direction="top"
                data-amount="-1"
                class="dev-helper-up"
              >
                ↑
              </button>

              <button
                type="button"
                data-direction="top"
                data-amount="1"
                class="dev-helper-down"
              >
                ↓
              </button>

              <button
                type="button"
                data-direction="left"
                data-amount="1"
                class="dev-helper-right"
              >
                →
              </button>

              <button
                type="button"
                data-direction="left"
                data-amount="-1"
                class="dev-helper-left"
              >
                ←
              </button>

          </section>

          <label for="addImageFileInput">Add image</label>
          <input
            type="file"
            name="addImageFileInput"
            id="addImageFileInput"
            class="dev-helper-file-input"
          >

          <input
            name="color"
            class="dev-helper-color-input"
            type="color"
          >

          <span class="dev-helper-loaded-file-name"></span>

          <label class="dev-helper-position-switch" for="togBtn">
            <input type="checkbox" id="togBtn">
            <div class="slider round">
              <span class="on">BOTTOM</span>
              <span class="off">TOP</span>
            </div>
          </label>


      </section>

    `;

    this.domElements = {
      paranja,
      rangeEl: paranja.querySelector('.dev-helper-opacity-input'),
      imgEl: paranja.querySelector('.dev-helper__img'),
      imageWrapper: paranja.querySelector('.dev-helper__img-wrapper'),
      colorPicker: paranja.querySelector('.dev-helper-color-input'),
      moveEl: paranja.querySelector('.dev-helper-move'),
      inputImage: paranja.querySelector('.dev-helper-file-input'),
      loadedFileName: paranja.querySelector('.dev-helper-loaded-file-name'),
      positionSwitch: paranja.querySelector('.dev-helper-position-switch input[type=checkbox]'),
    };

    document.body.appendChild(paranja);
  }

  initializeState = () => {
    const restoredState = restoreState();

    this.state.opacity = restoredState.opacity || 0.5;
    this.state.top = restoredState.top || 0;
    this.state.left = restoredState.left || 0;
    this.state.currentImageName = restoredState.currentImageName || 'no';
    this.state.currentImageSrc = restoredState.currentImageSrc || 'no';
    this.state.color = restoredState.color || '#f100ff';
    this.state.positionSwitch = restoredState.positionSwitch || false;
  }

  setDefaults = () => {
    this.state.opacity = 0.5;
    this.state.top = 0;
    this.state.left = 0;
    this.state.currentImageName = 'no';
    this.state.currentImageSrc = 'no';
    this.state.color = '#f100ff';
    this.state.positionSwitch = false;
  }

  bindListeners = () => {
    this.domElements.rangeEl.addEventListener('input', (e) => {
      this.state.opacity = e.target.value;
    });

    this.domElements.moveEl.addEventListener('click', (e) => {
      const { direction, amount } = e.target.dataset;
      this.state[direction] = +this.state[direction] + +amount;
    });

    this.domElements.inputImage.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const fileObj = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.setDefaults();
          this.state.currentImageName = fileObj.name;
          this.state.currentImageSrc = ev.target.result;
        };
        reader.readAsDataURL(fileObj);
      }
    });

    this.domElements.colorPicker.addEventListener('input', (e) => {
      this.state.color = e.target.value;
    });

    this.domElements.positionSwitch.addEventListener('input', (e) => {
      this.state.positionSwitch = e.target.checked;
    });
  }

  save = () => {
    console.log('...Saving');
    saveStateToLocalStorage(this.state);
  }

  // callbacks

  opacityCb = (val) => {
    this.domElements.rangeEl.value = val;
    this.domElements.imageWrapper.style.opacity = val;
  }

  topCb = (val) => {
    this.domElements.imageWrapper.style.top = `${val}px`;
  }

  leftCb = (val) => {
    this.domElements.imageWrapper.style.left = `${val}px`;
  }

  currentImageNameCb = (val) => {
    this.domElements.loadedFileName.innerText = val;
  }

  currentImageSrcCb = (val) => {
    this.domElements.imgEl.src = val;
  }

  colorCb = (val) => {
    this.domElements.colorPicker.value = val;
    this.domElements.imageWrapper.style.backgroundColor = val;
  }

  positionSwitchCb = (val) => {
    this.domElements.positionSwitch.checked = val;
    this.domElements.paranja.style.zIndex = val ? '-10000' : '10000';
  }
}
