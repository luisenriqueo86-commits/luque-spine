interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h2 className="section-title">{children}</h2>
);

export default SectionTitle;
