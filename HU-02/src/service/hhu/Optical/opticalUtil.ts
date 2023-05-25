import {uint8_t} from '../../../util/custom_typedef';
import { Optical_TimeRtcProps } from './opticalProtocol';

export function Get_State_Reset_By_User(state: uint8_t): string {
  let str = '';
  switch (state) {
    case 0:
      str = 'RESET_ID_NO_VALID_RESET';
      break;
    case 1:
      str = 'RESET_ID_CHECK_DATA_RIGHT\n';
      break;
    case 2:
      str = 'RESET_ID_ACTION_SAVE_PULSE\n';
      break;
    case 3:
      str = 'RESET_ID_BY_CMD_SERIAL\n';
      break;
    case 4:
      str = 'RESET_ID_BY_HANG_PROGRAM\n';
      break;
    case 5:
      str = 'RESET_ID_BY_WDG_TIMEOUT';
      break;
    case 6:
      str = 'RESET_ID_BY_SEN_OBJ_ABNORMAL';
      break;
    default:
      str = 'Unknown state: 0x' + state.toString(16);
      break;
  }

  return str;
}

export function Get_State_Reset(state: uint8_t): string {
  let str = '';
  switch (state) {
    case 0x00:
      str = 'No interrupt pending';
      break;
    case 0x01:
      str = 'by voltage detector';
      break;
    case 0x02:
      str = 'Brownout (BOR)' + ' || ' + 'by illegal-memory access';
      break;
    case 0x04:
      str = 'RSTIFG RST/NMI (BOR)' + ' || ' + 'by RAM parity error';
      break;
    case 0x06:
      str = 'PMMSWBOR software BOR (BOR)';
      break;
    case 0x08:
      str = 'LPMx.5 wakeup (BOR)';
      break;
    case 0x0a:
      str = 'Security violation (BOR)';
      break;
    case 0x0c:
      str = 'Reserved';
      break;
    case 0x0e:
      str = 'SVSHIFG SVSH event (BOR)';
      break;
    case 0x10:
      str = 'Reserved' + ' || ' + 'by watchdog timer';
      break;
    case 0x12:
      str = 'Reserved';
      break;
    case 0x14:
      str = 'PMMSWPOR software POR (POR)';
      break;
    case 0x16:
      str = 'WDTIFG watchdog time-out (PUC)';
      break;
    case 0x18:
      str = 'WDTPW password violation (PUC)';
      break;
    case 0x1a:
      str = 'FRCTLPW password violation (PUC)';
      break;
    case 0x1c:
      str = 'Uncorrectable FRAM bit error detection (PUC)';
      break;
    case 0x1e:
      str = 'Peripheral area fetch (PUC)';
      break;
    case 0x20:
      str = 'PMMPW PMM password violation (PUC)';
      break;
    case 0x22:
      str = 'MPUPW MPU password violation (PUC)';
      break;
    case 0x24:
      str = 'CSPW CS password violation (PUC)';
      break;
    case 0x26:
      str = 'MPUSEGPIFG encapsulated IP memory segment violation (PUC)';
      break;
    case 0x28:
      str = 'MPUSEGIIFG information memory segment violation (PUC)';
      break;
    case 0x2a:
      str = 'MPUSEG1IFG segment 1 memory violation (PUC)';
      break;
    case 0x2c:
      str = 'MPUSEG2IFG segment 2 memory violation (PUC)';
      break;
    case 0x2e:
      str = 'MPUSEG3IFG segment 3 memory violation (PUC)';
      break;
    case 0x30:
      str = 'ACCTEIFG access time error (PUC)';
      break;

    default:
      str = 'Unknown state: 0x' + state.toString(16);
      break;
  }
  return str;
}

export function convertRtcTime2String(time: Optical_TimeRtcProps): string
{
  const str = `${time.u8Date}-${time.u8Month}-${2000+ time.u8Year} ${time.u8Hour}:${time.u8Minute}:${time.u8Sec}`;
  return str;
}

export function getStateSend(state: uint8_t): string{
  let str = '';
  switch(state)
  {
    case 0:
      str = 'STATE_UNDEFINED';
      break;
    case 1:
      str = 'STATE_TX_SUCCEED';
      break;
    case 2:
      str = 'STATE_CHANEL_BUSY';
      break;
    case 3:
      str = 'STATE_TX_FAILED';
      break;
    case 4:
      str = 'STATE_NO_IP';
      break;
    case 5:
      str = 'STATE_OPEN_CONNECT_ERROR';
      break;
    case 6:
      str = 'STATE_PUB_ERROR';
      break;
    default:
      str = 'UNKNOWN' + state;
    break;
  }
  return str;
}

