// Deklarasi global untuk HSSelect pada objek window
declare global {
  interface Window {
    HSSelect: {
      getInstance: (element: HTMLElement) => any;
    };
  }
}

// Pastikan untuk mengekspor untuk menghindari masalah dengan file deklarasi
export {};
