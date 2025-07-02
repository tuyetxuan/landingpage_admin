import { StyleProvider } from "@ant-design/cssinjs";
import configAntd from "configs/Antd/theme";
import { ConfigProvider, theme } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import PropTypes from "prop-types";

dayjs.locale("vi");

const AntdConfig = ({ children }) => {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        locale={viVN}
        csp={{
          nonce: "default-nonce",
        }}
        theme={{
          token: {
            ...configAntd.token,
            motion: true,
          },
          components: {
            Button: {
              ...(configAntd.components?.Button || {}),
              controlTmpOutline: "transparent",
            },
            ...(configAntd.components || {}),
          },
          algorithm: theme.defaultAlgorithm,
        }}
        getPopupContainer={(triggerNode) =>
          triggerNode?.parentNode || document.body
        }
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};

AntdConfig.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AntdConfig;
