const Footer = () => {
  return (
    <div className="flex w-full flex-row flex-col items-center justify-between p-2 ">
      <h5 className="text-center text-sm font-medium text-gray-600 ">
        <p className="text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
          ©{1900 + new Date().getYear()} CCO MEDIA - LANDING PAGE. All rights
          reserved.
        </p>
      </h5>
    </div>
  );
};

export default Footer;
