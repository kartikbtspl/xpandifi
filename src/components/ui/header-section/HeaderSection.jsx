import Button from '../button/Button';

const HeaderSection = ({
  title,
  subtitle,
  showButton = true,
  buttonLabel = 'Create Campaign',
  onButtonClick,
  titleClass = '',
  subtitleClass = '',
  welcomeTextClass = '',
  containerClass = '',
  buttonClass = '',
}) => {
  const showTextBlock = subtitle || title;

  return (
    <div className={containerClass || 'flex items-center justify-between mb-2 w-full'}>
      {showTextBlock && (
        <div>
          {subtitle ? (
            <>
              <p className={welcomeTextClass || 'text-3xl text-[#202020]'}>Welcome Back,</p>
              <h1 className={subtitleClass || 'text-[#445E94]'}>
                {subtitle}
              </h1>
            </>
          ) : (
            <h1 className={titleClass || 'text-sm font-semibold text-gray-800'}>
              {title}
            </h1>
          )}
        </div>
      )}

      {showButton && (
        <Button
          label={buttonLabel}
          onClick={onButtonClick}
          className={buttonClass}
        />
      )}
    </div>
  );
};

export default HeaderSection;
