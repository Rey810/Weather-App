//  adds a transition from the left with a cubic bezier easing function
export default function menuControl(closeButtonID, openButtonID, menuID) {
  function menuToggle() {
    console.info('Inside closeMenu');
    const menu = document.querySelector(`#${menuID}`);
    menu.classList.toggle('visible');
    menu.classList.toggle('hidden');
  }

  const menuCloseButton = document.querySelector(`#${closeButtonID}`);
  menuCloseButton.addEventListener('click', menuToggle);

  const menuOpenButton = document.querySelector(`#${openButtonID}`);
  menuOpenButton.addEventListener('click', menuToggle);
}
