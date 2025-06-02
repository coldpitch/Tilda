<script>
document.addEventListener("DOMContentLoaded", function () {

  let dnPayment1 = 'КАРТА CLASSIC 5%';
  let dnPayment2 = 'КАРТА PREMIUM 10%';
  let dnPayment3 = 'КАРТА GOLD 15%';
  let disclvl = window.disclvl || 0;

  let allDiscounts = [dnPayment1, dnPayment2, dnPayment3];
  let observer;
  let elem;
  let isUpdating = false;
  const observerConfig = {
    childList: true,
    subtree: true,
    characterDataOldValue: true
  };

  function updateDiscountsInCart() {
    let newDiscounts = [];
    if (typeof t_cart__discounts === 'undefined') return;

    for (let d of t_cart__discounts) {
      if (!allDiscounts.includes(d.name)) newDiscounts.push(d);
    }

    if (disclvl > 0 && disclvl <= 3) {
      let selectedName = allDiscounts[disclvl - 1];
      let selectedDiscount = t_cart__discounts.find(d => d.name === selectedName);
      if (selectedDiscount) {
        newDiscounts.push(selectedDiscount);
        setTimeout(function () {
          let descr = document.querySelector('.t706__cartwin-discounts__description li');
          if (descr) {
            descr.innerText = selectedName;
          }
        }, 500);
      }
    }

    t_cart__discounts = newDiscounts;
    tcart__updateTotalProductsinCartObj();
    tcart__reDrawTotal();
    tcart__saveLocalObj();
  }

  function safeUpdateDiscounts() {
    if (isUpdating) return;
    isUpdating = true;
    if (observer) observer.disconnect();
    updateDiscountsInCart();
    setTimeout(() => {
      if (observer && elem) observer.observe(elem, observerConfig);
      isUpdating = false;
    }, 300);
  }

  const isCartPage = window.location.pathname.includes('/lk/cart');

  if (!isCartPage) {
    let clearIntervalAwait = setInterval(() => {
      if (typeof t_cart__discounts !== 'undefined') {
        clearInterval(clearIntervalAwait);
        t_cart__discounts = t_cart__discounts.filter(d => !allDiscounts.includes(d.name));
        tcart__updateTotalProductsinCartObj();
        tcart__reDrawTotal();
        tcart__saveLocalObj();
      }
    }, 100);
    return;
  }

  setTimeout(function () {
    let discountAwait = setInterval(function () {
      if (typeof t_cart__discounts !== 'undefined') {
        clearInterval(discountAwait);
        updateDiscountsInCart();
      }
    }, 100);

    let tcartAwait = setInterval(function () {
      elem = document.querySelector('.t706__cartwin-prodamount');
      if (elem !== void 0 && elem !== null) {
        clearInterval(tcartAwait);
        observer = new MutationObserver(() => safeUpdateDiscounts());
        observer.observe(elem, observerConfig);
      }
    }, 100);
  }, 1000);

});
</script>
