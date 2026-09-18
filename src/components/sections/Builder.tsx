import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IceCream } from '../art/IceCream';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { WhatsappIcon } from '../ui/Icons';
import { builderFlavors, extras, sizes, toppings } from '../../data/builder';
import { buildWhatsAppLink, formatPrice, site } from '../../data/site';
import './Builder.css';

/* ==========================================================================
   Monte seu sorvete.

   Toda a regra de negócio vive aqui e o resto do site não sabe nada dela:
   - o tamanho define quantas bolas cabem (e corta o excesso ao trocar);
   - escolher uma bola além do limite substitui a mais antiga, em vez de
     simplesmente bloquear o clique (menos frustrante);
   - o preço é recalculado a cada escolha;
   - o pedido montado vira uma mensagem de WhatsApp.

   A função de envio é o único ponto de integração: trocar buildWhatsAppLink
   por uma chamada de API é suficiente para ligar isso a um sistema real.
   ========================================================================== */

/* Uma bola "fantasma" enquanto nada foi escolhido. */
const PLACEHOLDER = { light: '#f3eefb', base: '#e4dcf3', deep: '#cbc0e0' };

type OrderItem = {
  id: number;
  label: string;
  detail: string;
  price: number;
};

export function Builder() {
  const [sizeId, setSizeId] = useState(sizes[1].id);
  const [pickedFlavors, setPickedFlavors] = useState<string[]>([builderFlavors[0].id]);
  const [pickedToppings, setPickedToppings] = useState<string[]>(['chocolate']);
  const [pickedExtras, setPickedExtras] = useState<string[]>([]);
  const [order, setOrder] = useState<OrderItem[]>([]);

  const size = sizes.find((option) => option.id === sizeId) ?? sizes[0];

  /* ------------------------------ seleções ------------------------------ */

  const changeSize = (id: string) => {
    const next = sizes.find((option) => option.id === id);
    if (!next) return;
    setSizeId(id);
    /* diminuiu o tamanho? mantém as primeiras bolas escolhidas */
    setPickedFlavors((current) => current.slice(0, next.scoops));
  };

  const toggleFlavor = (id: string) => {
    setPickedFlavors((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= size.scoops) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  const toggleFrom =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
      setter((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
      );
    };

  const toggleTopping = toggleFrom(setPickedToppings);
  const toggleExtra = toggleFrom(setPickedExtras);

  /* -------------------------------- preço -------------------------------- */

  const total = useMemo(() => {
    const toppingsPrice = pickedToppings.reduce(
      (sum, id) => sum + (toppings.find((item) => item.id === id)?.price ?? 0),
      0,
    );
    const extrasPrice = pickedExtras.reduce(
      (sum, id) => sum + (extras.find((item) => item.id === id)?.price ?? 0),
      0,
    );
    return size.price + toppingsPrice + extrasPrice;
  }, [size, pickedToppings, pickedExtras]);

  /* ------------------------------- preview ------------------------------- */

  const previewScoops = useMemo(() => {
    const chosen = pickedFlavors
      .map((id) => builderFlavors.find((flavor) => flavor.id === id))
      .filter((flavor): flavor is (typeof builderFlavors)[number] => Boolean(flavor))
      .map(({ light, base, deep }) => ({ light, base, deep }));

    return chosen.length > 0 ? chosen : [PLACEHOLDER];
  }, [pickedFlavors]);

  const previewToppings = pickedToppings
    .map((id) => toppings.find((item) => item.id === id)?.color)
    .filter((color): color is string => Boolean(color));

  const previewExtras = pickedExtras
    .map((id) => extras.find((item) => item.id === id)?.color)
    .filter((color): color is string => Boolean(color));

  /* assinatura da composição: muda a cada escolha e dispara o "pop" do preview */
  const signature = [sizeId, ...pickedFlavors, ...pickedToppings, ...pickedExtras].join('|');

  /* -------------------------------- pedido ------------------------------- */

  const nameOf = (list: { id: string; name: string }[], ids: string[]) =>
    ids.map((id) => list.find((item) => item.id === id)?.name ?? '').filter(Boolean);

  const addToOrder = () => {
    if (pickedFlavors.length === 0) return;

    const flavorNames = nameOf(builderFlavors, pickedFlavors);
    const toppingNames = nameOf(toppings, pickedToppings);
    const extraNames = nameOf(extras, pickedExtras);

    const detail = [
      `Sabores: ${flavorNames.join(', ')}`,
      toppingNames.length ? `Coberturas: ${toppingNames.join(', ')}` : '',
      extraNames.length ? `Complementos: ${extraNames.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    setOrder((current) => [
      ...current,
      { id: Date.now(), label: `Sorvete ${size.name}`, detail, price: total },
    ]);
  };

  const removeItem = (id: number) =>
    setOrder((current) => current.filter((item) => item.id !== id));

  const orderTotal = order.reduce((sum, item) => sum + item.price, 0);

  /* Mensagem pronta para o WhatsApp — o "envio" do pedido. */
  const orderMessage = useMemo(() => {
    const lines = order.map(
      (item, index) =>
        `${index + 1}. ${item.label} — ${formatPrice(item.price)}\n   ${item.detail}`,
    );
    return `Olá, ${site.name}! Quero fazer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${formatPrice(orderTotal)}`;
  }, [order, orderTotal]);

  return (
    <section className="section builder" id="monte">
      <div className="container">
        <SectionHeading
          eyebrow="Experiência"
          title="Monte seu sorvete"
          lead="Escolha o tamanho, as bolas, a cobertura e os complementos. O preço acompanha suas escolhas em tempo real."
          align="center"
        />

        <Reveal className="builder__panel" y={36}>
          <div className="builder__preview">
            <span className="builder__preview-glow" aria-hidden="true" />

            <AnimatePresence mode="wait">
              <motion.div
                key={signature}
                className="builder__preview-art"
                initial={{ scale: 0.94, opacity: 0.35 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
              >
                <IceCream
                  scoops={previewScoops}
                  toppings={previewToppings}
                  extras={previewExtras}
                  label="Prévia do sorvete que você está montando"
                />
              </motion.div>
            </AnimatePresence>

            <div className="builder__readout">
              <p className="builder__readout-size">
                {size.name} · {size.hint}
              </p>
              <p className="builder__readout-price">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={total}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0, position: 'absolute' }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {formatPrice(total)}
                  </motion.span>
                </AnimatePresence>
              </p>
              <p className="builder__readout-hint" aria-live="polite">
                {pickedFlavors.length === 0
                  ? 'Escolha pelo menos uma bola'
                  : `${pickedFlavors.length} de ${size.scoops} ${size.scoops === 1 ? 'bola' : 'bolas'}`}
              </p>
            </div>
          </div>

          <div className="builder__options">
            {/* ---------------- tamanho ---------------- */}
            <fieldset className="builder__group">
              <legend className="builder__legend">
                <span className="builder__step">1</span> Tamanho
              </legend>
              <div className="builder__sizes">
                {sizes.map((option) => (
                  <label
                    key={option.id}
                    className={`size ${sizeId === option.id ? 'size--on' : ''}`}
                  >
                    <input
                      type="radio"
                      name="tamanho"
                      value={option.id}
                      checked={sizeId === option.id}
                      onChange={() => changeSize(option.id)}
                      className="sr-only"
                    />
                    <span className="size__name">{option.name}</span>
                    <span className="size__hint">{option.hint}</span>
                    <span className="size__price">{formatPrice(option.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* ---------------- sabores ---------------- */}
            <fieldset className="builder__group">
              <legend className="builder__legend">
                <span className="builder__step">2</span> Sabores
                <span className="builder__limit">até {size.scoops}</span>
              </legend>
              <div className="builder__chips">
                {builderFlavors.map((flavor) => {
                  const on = pickedFlavors.includes(flavor.id);
                  return (
                    <label key={flavor.id} className={`chip ${on ? 'chip--on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleFlavor(flavor.id)}
                        className="sr-only"
                      />
                      <span
                        className="chip__swatch"
                        style={{
                          background: `linear-gradient(140deg, ${flavor.light}, ${flavor.base} 60%, ${flavor.deep})`,
                        }}
                        aria-hidden="true"
                      />
                      {flavor.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* ---------------- coberturas ---------------- */}
            <fieldset className="builder__group">
              <legend className="builder__legend">
                <span className="builder__step">3</span> Coberturas
                <span className="builder__limit">+ {formatPrice(2)} cada</span>
              </legend>
              <div className="builder__chips">
                {toppings.map((topping) => {
                  const on = pickedToppings.includes(topping.id);
                  return (
                    <label key={topping.id} className={`chip ${on ? 'chip--on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleTopping(topping.id)}
                        className="sr-only"
                      />
                      <span
                        className="chip__swatch chip__swatch--flat"
                        style={{ background: topping.color }}
                        aria-hidden="true"
                      />
                      {topping.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* ---------------- complementos ---------------- */}
            <fieldset className="builder__group">
              <legend className="builder__legend">
                <span className="builder__step">4</span> Complementos
                <span className="builder__limit">+ {formatPrice(3)} cada</span>
              </legend>
              <div className="builder__chips">
                {extras.map((extra) => {
                  const on = pickedExtras.includes(extra.id);
                  return (
                    <label key={extra.id} className={`chip ${on ? 'chip--on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleExtra(extra.id)}
                        className="sr-only"
                      />
                      <span
                        className="chip__swatch chip__swatch--flat"
                        style={{ background: extra.color }}
                        aria-hidden="true"
                      />
                      {extra.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="builder__submit">
              <Button
                onClick={addToOrder}
                size="lg"
                disabled={pickedFlavors.length === 0}
                full
              >
                Adicionar ao pedido · {formatPrice(total)}
              </Button>
            </div>
          </div>
        </Reveal>

        {/* ---------------- resumo do pedido ---------------- */}
        <AnimatePresence>
          {order.length > 0 ? (
            <motion.div
              className="builder__cart"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="builder__cart-head">
                <h3 className="builder__cart-title">Seu pedido</h3>
                <button
                  type="button"
                  className="builder__cart-clear"
                  onClick={() => setOrder([])}
                >
                  Limpar tudo
                </button>
              </div>

              <ul className="builder__cart-list">
                <AnimatePresence initial={false}>
                  {order.map((item) => (
                    <motion.li
                      key={item.id}
                      className="builder__cart-item"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28 }}
                    >
                      <div className="builder__cart-info">
                        <p className="builder__cart-name">{item.label}</p>
                        <p className="builder__cart-detail">{item.detail}</p>
                      </div>
                      <span className="builder__cart-price">{formatPrice(item.price)}</span>
                      <button
                        type="button"
                        className="builder__cart-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remover ${item.label} do pedido`}
                      >
                        ×
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="builder__cart-foot">
                <p className="builder__cart-total">
                  Total <strong>{formatPrice(orderTotal)}</strong>
                </p>
                <Button
                  href={buildWhatsAppLink(orderMessage)}
                  size="lg"
                  icon={<WhatsappIcon size={18} />}
                >
                  Enviar pedido
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
