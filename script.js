gsap.registerPlugin(ScrollTrigger);

// 1. Плавный скролл Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 2. Начальные состояния (убираем вспышки до загрузки)
gsap.set(".galaxy-img", { x: "40vw", scale: 0.5, opacity: 0 });
gsap.set(".text-overlay", { opacity: 0, y: 50 });
gsap.set(".description", { opacity: 0, y: 20 });

const mm = gsap.matchMedia();

// 🖥 Десктоп: сложная анимация с разъездом
mm.add("(min-width: 768px)", () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-stage",
      start: "top top",
      end: "+=350%",
      scrub: 1.5,
      pin: ".stage-inner",
      anticipatePin: 1,
    },
  });

  tl.to(".galaxy-img", {
    x: 0,
    scale: 1.15,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
  })
    .to(".text-overlay", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
    .to(".galaxy-img", { x: "-24vw", scale: 0.85, duration: 0.6 }, "split")
    .to(".text-overlay", { x: "24vw", duration: 0.6 }, "split")
    .to(".description", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
});

// 📱 Мобильные: упрощённая вертикальная анимация
mm.add("(max-width: 767px)", () => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scroll-stage",
      start: "top top",
      end: "+=250%",
      scrub: 1,
      pin: ".stage-inner",
    },
  });

  tl.to(".galaxy-img", { x: 0, scale: 1, opacity: 1, duration: 0.5 })
    .to(".text-overlay", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
    .to(".galaxy-img", { y: "-15vh", scale: 0.9, duration: 0.5 }, "split")
    .to(".text-overlay", { y: "15vh", duration: 0.5 }, "split")
    .to(".description", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
});

// 🔑 Плавное появление блока поздравления (после отступа)
gsap.to(".message-content", {
  scrollTrigger: {
    trigger: ".message-section",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
});

// 3. Эффект печати текста
function typeText(element, text, speed = 30) {
  let i = 0;
  element.classList.add("typing-cursor");

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.classList.remove("typing-cursor");
    }
  }
  type();
}

ScrollTrigger.create({
  trigger: ".message-section",
  start: "top 65%",
  onEnter: () => {
    const el = document.querySelector(".message-text");
    const fullText = el.dataset.text;
    el.textContent = "";
    typeText(el, fullText, 28);
  },
  once: true,
});

// 4. Кнопка "Поделиться"
document.getElementById("share-btn")?.addEventListener("click", function () {
  navigator.clipboard.writeText("🌌 Галактика 7 мая: NGC 3982!");
  const btn = this;
  const original = btn.innerText;
  btn.innerText = "✓ Скопировано";
  setTimeout(() => (btn.innerText = original), 2000);
});
