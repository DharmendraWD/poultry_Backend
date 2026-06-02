const phoneNumber = "+9779840914606";

const message = `
Hello
`;

const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

export default function WhatsappBtn() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
     className="bg-[var(--color-primary)] p-[20px] text-center hover:bg-[var(--color-primary-hover)] rounded whatsapp-btn"
    >
      Order on WhatsApp
    </a>
  );
}