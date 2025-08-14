var active = 3;
var mncircles = document.querySelectorAll(".mncircle");
var sec = document.querySelectorAll(".sec");

updateActive(active - 1);

mncircles.forEach((circle, index) => {
  circle.addEventListener("click", () => {
    active = index + 1;
    gsap.to("#circle", {
      rotation: (3 - active) * 10,
      ease: Expo.easeInOut,
      duration: 1
    });
    updateActive(index);
  });
});

function updateActive(activeIndex) {
  // Update circles
  mncircles.forEach((c, i) => {
    gsap.to(c, {
      opacity: i === activeIndex ? 1 : 0.5,
      duration: 0.5
    });
  });

  // Update sections
  sec.forEach((s, i) => {
    gsap.to(s, {
      opacity: i === activeIndex ? 1 : 0.4,
      duration: 0.5
    });
  });
}

gsap.to("#circle", {
  rotation: 0,
  ease: Expo.easeInOut,
  duration: 2
});
