import { Datasheet, PCBBoard, ProjectRecord } from '../types';

export const DATASHEETS: Datasheet[] = [
  {
    id: 'ds-lm7805',
    partNumber: 'LM7805',
    title: '3-Terminal 1.5A Positive Voltage Regulator',
    manufacturer: 'Texas Instruments / STMicroelectronics',
    category: 'Regulator',
    summary: 'The LM7805 series of three-terminal positive regulators are available in the TO-220 package and with several fixed output voltages, making them useful in a wide range of applications. Each type employs internal current limiting, thermal shutdown, and safe operating area protection.',
    packageTypes: ['TO-220', 'TO-263 (D2PAK)', 'SOT-223'],
    pinout: [
      { pin: 1, name: 'INPUT', function: 'Unregulated DC input voltage (7V to 25V recommended, 35V max)' },
      { pin: 2, name: 'GND', function: 'Ground reference / tab connection' },
      { pin: 3, name: 'OUTPUT', function: 'Regulated +5.0V output voltage (up to 1.5A with heatsink)' },
    ],
    electricalSpecs: [
      { parameter: 'Output Voltage', symbol: 'Vo', min: '4.8', typ: '5.0', max: '5.2', unit: 'V', condition: 'Tj = 25°C, Io = 500mA, Vi = 10V' },
      { parameter: 'Line Regulation', symbol: 'Regline', typ: '3.0', max: '50', unit: 'mV', condition: '7V ≤ Vi ≤ 25V, Io = 500mA' },
      { parameter: 'Load Regulation', symbol: 'Regload', typ: '15', max: '50', unit: 'mV', condition: '5mA ≤ Io ≤ 1.5A' },
      { parameter: 'Quiescent Current', symbol: 'Iq', typ: '4.2', max: '8.0', unit: 'mA', condition: 'Io = 0, Vi = 10V' },
      { parameter: 'Dropout Voltage', symbol: 'Vd', typ: '2.0', max: '2.5', unit: 'V', condition: 'Io = 1.0A, Tj = 25°C' },
      { parameter: 'Peak Output Current', symbol: 'Ipeak', typ: '2.2', unit: 'A', condition: 'Vi - Vo = 5V' },
    ],
    applications: [
      'Linear power supplies for 5V digital logic (TTL, CMOS, MCU)',
      'On-board regulation to eliminate noise associated with single-point distribution',
      'Post-regulator for switching power supplies',
      'Adjustable output regulator (with resistive divider)'
    ],
    typicalCircuitDescription: 'Requires a minimum 0.33 µF tantalum or ceramic capacitor on the input pin located close to the device if the regulator is an appreciable distance from the power supply filter. Output requires 0.1 µF bypass capacitor to improve transient stability and frequency response.'
  },
  {
    id: 'ds-ams1117-33',
    partNumber: 'AMS1117-3.3',
    title: '1A Low Dropout Positive Voltage Regulator',
    manufacturer: 'Advanced Monolithic Systems',
    category: 'Regulator',
    summary: 'The AMS1117 is a low dropout three-terminal regulator with 1A output current capability. The dropout voltage of the device is guaranteed maximum 1.3V at maximum output current, decreasing at lower load currents.',
    packageTypes: ['SOT-223', 'TO-252 (DPAK)', 'SO-8'],
    pinout: [
      { pin: 1, name: 'GND/ADJ', function: 'Ground connection for fixed versions; adjust for variable' },
      { pin: 2, name: 'VOUT', function: 'Regulated 3.3V output (connected internally to Tab)' },
      { pin: 3, name: 'VIN', function: 'Input voltage (up to 12V max, recommended 4.75V - 7V)' },
    ],
    electricalSpecs: [
      { parameter: 'Output Voltage', symbol: 'Vo', min: '3.234', typ: '3.300', max: '3.366', unit: 'V', condition: '10mA ≤ Io ≤ 1A, 4.75V ≤ Vi ≤ 10V' },
      { parameter: 'Dropout Voltage', symbol: 'Vd', typ: '1.1', max: '1.3', unit: 'V', condition: 'Io = 1A' },
      { parameter: 'Current Limit', symbol: 'Ilimit', min: '1.1', typ: '1.5', unit: 'A', condition: 'Vi - Vo = 5V' },
      { parameter: 'Ripple Rejection', symbol: 'PSRR', min: '60', typ: '75', unit: 'dB', condition: 'f = 120Hz' }
    ],
    applications: [
      'High Efficiency Linear Regulators for 3.3V Microcontrollers (ESP32, STM32)',
      'Active SCSI Terminators',
      'Post Regulators for Switching Supplies',
      'Battery Chargers'
    ],
    typicalCircuitDescription: 'A minimum 22 µF tantalum output capacitor is required for loop stability. ESR between 0.3Ω and 22Ω is recommended.'
  },
  {
    id: 'ds-atmega328p',
    partNumber: 'ATmega328P',
    title: 'High Performance 8-bit AVR RISC Microcontroller',
    manufacturer: 'Microchip Technology / Atmel',
    category: 'IC',
    summary: 'The low-power Microchip 8-bit AVR RISC-based microcontroller combines 32 KB ISP flash memory with read-while-write capabilities, 1 KB EEPROM, 2 KB SRAM, 23 general purpose I/O lines, 32 general purpose working registers, three flexible timer/counters with compare modes, internal and external interrupts, serial programmable USART, a byte-oriented 2-wire serial interface, SPI serial port, 6-channel 10-bit A/D converter.',
    packageTypes: ['TQFP-32', 'PDIP-28', 'QFN/MLF-32'],
    pinout: [
      { pin: 1, name: 'PC6/RESET', function: 'Active-low reset pin or PC6 I/O' },
      { pin: 7, name: 'VCC', function: 'Digital power supply voltage (+1.8V to +5.5V)' },
      { pin: 8, name: 'GND', function: 'Ground reference' },
      { pin: 9, name: 'XTAL1', function: 'External crystal oscillator input / inverting amplifier' },
      { pin: 10, name: 'XTAL2', function: 'External crystal oscillator output' },
      { pin: 20, name: 'AVCC', function: 'Analog supply voltage for ADC (tied to VCC via LC filter)' },
      { pin: 22, name: 'GND_A', function: 'Analog ground reference' },
    ],
    electricalSpecs: [
      { parameter: 'Operating Voltage', symbol: 'Vcc', min: '1.8', typ: '5.0', max: '5.5', unit: 'V' },
      { parameter: 'Clock Frequency', symbol: 'Fosc', min: '0', typ: '16', max: '20', unit: 'MHz', condition: 'Vcc ≥ 4.5V' },
      { parameter: 'Active Supply Current', symbol: 'Icc', typ: '4.0', max: '9.0', unit: 'mA', condition: '16 MHz, 5V, Active Mode' },
      { parameter: 'Power-down Current', symbol: 'Ipd', typ: '0.1', max: '1.0', unit: 'µA', condition: '3V, WDT disabled' }
    ],
    applications: [
      'Industrial automation controllers',
      'Arduino Uno / Nano prototyping hardware',
      'Smart sensor telemetry interfaces',
      'Appliance control boards'
    ],
    typicalCircuitDescription: 'Crystal oscillator circuit requires 16MHz crystal with two 22pF ceramic load capacitors to ground. Decoupling capacitor 0.1µF required across VCC and GND close to pin 7/8.'
  },
  {
    id: 'ds-1n4007',
    partNumber: '1N4007',
    title: '1.0 Amp Standard Recovery Silicon Rectifier',
    manufacturer: 'Vishay / ON Semiconductor',
    category: 'Diode',
    summary: 'General-purpose rectifier with 1000V peak reverse voltage capability and 1.0A forward current rating. Diffused junction technology with low reverse leakage.',
    packageTypes: ['DO-41', 'SMA (M7 SMD equivalent)'],
    pinout: [
      { pin: 1, name: 'ANODE', function: 'Positive terminal in forward conduction' },
      { pin: 2, name: 'CATHODE', function: 'Cathode marked with silver / white band' },
    ],
    electricalSpecs: [
      { parameter: 'Peak Reverse Voltage', symbol: 'VRRM', max: '1000', unit: 'V' },
      { parameter: 'Forward Voltage Drop', symbol: 'VF', typ: '0.7', max: '1.1', unit: 'V', condition: 'IF = 1.0A' },
      { parameter: 'Average Forward Current', symbol: 'IF(AV)', max: '1.0', unit: 'A', condition: 'Ta = 75°C' },
      { parameter: 'Peak Surge Current', symbol: 'IFSM', max: '30', unit: 'A', condition: '8.3ms single half sine-wave' }
    ],
    applications: [
      'Power supply AC mains rectification (bridge or half-wave)',
      'Reverse polarity protection on DC inputs',
      'Flyback inductive kickback clamping'
    ],
    typicalCircuitDescription: 'Connected in series with input rail for reverse battery/DC polarity protection, or antiparallel with inductive relay coil.'
  }
];

export const MOCK_BOARDS: PCBBoard[] = [
  {
    id: 'board-psu-01',
    name: 'Main Board #01 — 5V Regulated Power Supply',
    boardCode: 'PSU-7805-REV2',
    layerCount: 2,
    dimensions: '84.0 x 52.5 mm',
    thumbnailColor: '#064e3b',
    uploadedAt: '2026-09-04 14:22:18',
    presetType: 'power_supply',
    components: [
      {
        id: 'U1',
        name: 'LM7805',
        type: 'Regulator',
        package: 'TO-220',
        confidence: 97,
        status: 'normal',
        ocrMarking: 'LM7805CV ST e3',
        description: 'Linear 5.0V positive voltage regulator rated for up to 1.5A output with integrated thermal overload shutdown.',
        specs: {
          inputVoltage: '7.0V - 25.0V DC',
          outputVoltage: '5.00V ± 2%',
          ratedCurrent: '1.5A Max',
          operatingTemp: '0°C to +125°C',
          mounting: 'THT'
        },
        bbox: { x: 38, y: 22, width: 22, height: 26 },
        pins: [
          { pin: 1, label: 'INPUT', type: 'IN', expectedVoltage: '12.0V DC', measuredVoltage: '11.92V DC', description: 'Raw DC rectified input' },
          { pin: 2, label: 'GND', type: 'GND', expectedVoltage: '0.00V', measuredVoltage: '0.00V', description: 'Common system ground' },
          { pin: 3, label: 'OUTPUT', type: 'OUT', expectedVoltage: '5.00V DC', measuredVoltage: '4.98V DC', description: 'Regulated logic supply rail' }
        ],
        datasheetId: 'ds-lm7805'
      },
      {
        id: 'C14',
        name: '100µF 25V',
        type: 'Capacitor',
        package: 'Radial Aluminum Electrolytic (Ø 6.3mm)',
        confidence: 78,
        status: 'inspection',
        ocrMarking: '100µF 25V 105°C PET',
        description: 'Aluminum electrolytic filter capacitor on secondary output rail downstream of regulator U1.',
        specs: {
          capacitance: '100 µF',
          inputVoltage: '25V DC Max',
          tolerance: '±20%',
          operatingTemp: '-40°C to +105°C',
          mounting: 'THT'
        },
        bbox: { x: 64, y: 26, width: 14, height: 18 },
        pins: [
          { pin: 1, label: '+ (POS)', type: 'PWR', expectedVoltage: '5.00V', measuredVoltage: '4.68V (Ripple High)', description: 'Connected to +5V rail' },
          { pin: 2, label: '- (NEG)', type: 'GND', expectedVoltage: '0.00V', measuredVoltage: '0.00V', description: 'Polarity stripe ground pad' }
        ],
        fault: {
          id: 'fault-c14',
          componentId: 'C14',
          componentRef: 'C14',
          title: 'C14 — Possible Visual Anomaly',
          severity: 'inspection',
          confidence: 78,
          indicators: [
            'Physical dome bulge detected on aluminum top vent (score: 0.81)',
            'Localized surface discoloration / heat patina near positive terminal',
            'Possible elevated ESR or dielectric degradation'
          ],
          recommendation: 'Inspect the component and verify electrical measurements. Use an in-circuit ESR meter or LCR bridge to verify capacitance ≥80µF and ESR < 0.6Ω before powering sensitive downstream loads.',
          diagnosisStage: 'ai_suspicion',
          measurements: [
            {
              id: 'm1',
              testPoint: 'TP4 (+5V Rail to GND)',
              type: 'voltage',
              expected: '5.00 V DC',
              measured: '4.82 V DC (180mV pk-pk AC ripple)',
              unit: 'V',
              verified: true,
              status: 'marginal'
            },
            {
              id: 'm2',
              testPoint: 'C14 ESR Test (De-soldered/In-circuit)',
              type: 'resistance',
              expected: '< 0.50 Ω',
              measured: '3.42 Ω (Abnormally High)',
              unit: 'Ω',
              verified: true,
              status: 'failed'
            }
          ],
          notes: 'Visual scoring triggered on radial vent distortion. Measured elevated ripple corroborates visual suspicion.'
        }
      },
      {
        id: 'D1',
        name: '1N4007',
        type: 'Diode',
        package: 'DO-41',
        confidence: 96,
        status: 'normal',
        ocrMarking: '1N4007 MIC',
        description: 'Reverse-polarity protection diode across input barrel connector.',
        specs: {
          inputVoltage: '1000V Peak Reverse',
          ratedCurrent: '1.0A Continuous',
          tolerance: 'Standard Rectifier',
          mounting: 'THT'
        },
        bbox: { x: 12, y: 34, width: 16, height: 10 },
        pins: [
          { pin: 1, label: 'ANODE', type: 'IN', expectedVoltage: '12.0V', measuredVoltage: '12.0V' },
          { pin: 2, label: 'CATHODE', type: 'OUT', expectedVoltage: '11.3V', measuredVoltage: '11.3V' }
        ],
        datasheetId: 'ds-1n4007'
      },
      {
        id: 'C1',
        name: '0.33µF 50V',
        type: 'Capacitor',
        package: 'Ceramic Disc / 0805',
        confidence: 94,
        status: 'normal',
        ocrMarking: '334K',
        description: 'Input decoupling bypass capacitor placed adjacent to U1 input pin.',
        specs: {
          capacitance: '0.33 µF (330 nF)',
          inputVoltage: '50V',
          tolerance: '±10%',
          mounting: 'SMD'
        },
        bbox: { x: 28, y: 22, width: 8, height: 10 },
        pins: [
          { pin: 1, label: '1', type: 'IN', expectedVoltage: '11.3V' },
          { pin: 2, label: '2', type: 'GND', expectedVoltage: '0.0V' }
        ]
      },
      {
        id: 'C2',
        name: '0.1µF 50V',
        type: 'Capacitor',
        package: 'MLCC 0805',
        confidence: 95,
        status: 'normal',
        ocrMarking: '104',
        description: 'High-frequency noise decoupling capacitor directly on U1 output pin.',
        specs: {
          capacitance: '0.1 µF (100 nF)',
          inputVoltage: '50V',
          tolerance: '±10%',
          mounting: 'SMD'
        },
        bbox: { x: 62, y: 46, width: 8, height: 10 },
        pins: [
          { pin: 1, label: '1', type: 'OUT', expectedVoltage: '5.00V' },
          { pin: 2, label: '2', type: 'GND', expectedVoltage: '0.0V' }
        ]
      },
      {
        id: 'R1',
        name: '1.0 kΩ 1/4W',
        type: 'Resistor',
        package: 'Axial CFR / 1206',
        confidence: 93,
        status: 'normal',
        ocrMarking: 'BRN-BLK-RED-GLD (102)',
        description: 'Current-limiting ballast resistor in series with power indicator LED D2.',
        specs: {
          resistance: '1.0 kΩ',
          ratedCurrent: '250 mW',
          tolerance: '±5%',
          mounting: 'THT'
        },
        bbox: { x: 74, y: 52, width: 14, height: 8 },
        pins: [
          { pin: 1, label: '1', type: 'PWR', expectedVoltage: '5.0V' },
          { pin: 2, label: '2', type: 'PWR', expectedVoltage: '2.1V' }
        ]
      },
      {
        id: 'D2',
        name: 'Green LED 3mm',
        type: 'Diode',
        package: 'Radial 3mm T-1',
        confidence: 98,
        status: 'normal',
        ocrMarking: 'PWR_IND',
        description: 'System power health indicator LED on +5V regulated rail.',
        specs: {
          inputVoltage: '2.1V Forward Drop',
          ratedCurrent: '20mA Max',
          mounting: 'THT'
        },
        bbox: { x: 80, y: 64, width: 10, height: 12 },
        pins: [
          { pin: 1, label: 'ANODE', type: 'PWR', expectedVoltage: '2.1V' },
          { pin: 2, label: 'CATHODE', type: 'GND', expectedVoltage: '0.0V' }
        ]
      },
      {
        id: 'J1',
        name: 'DC Barrel Jack 2.1mm',
        type: 'Connector',
        package: 'PJ-002AH Thru-Hole',
        confidence: 99,
        status: 'normal',
        ocrMarking: 'DC_IN 12V',
        description: 'Center-positive 2.1mm x 5.5mm DC barrel power receptacle.',
        specs: {
          inputVoltage: '24V DC Max',
          ratedCurrent: '5A Max',
          mounting: 'THT'
        },
        bbox: { x: 6, y: 18, width: 14, height: 18 },
        pins: [
          { pin: 1, label: 'CENTER (+)', type: 'IN', expectedVoltage: '12.0V' },
          { pin: 2, label: 'SLEEVE (-)', type: 'GND', expectedVoltage: '0.0V' }
        ]
      },
      {
        id: 'TB1',
        name: 'Screw Terminal 2-Pin',
        type: 'Connector',
        package: '5.08mm Pitch Euroblock',
        confidence: 97,
        status: 'normal',
        ocrMarking: '+5V GND OUT',
        description: 'Output screw terminal block for powering external peripheral circuits.',
        specs: {
          inputVoltage: '300V Max',
          ratedCurrent: '15A Max',
          mounting: 'THT'
        },
        bbox: { x: 82, y: 16, width: 14, height: 26 },
        pins: [
          { pin: 1, label: '+5V_OUT', type: 'OUT', expectedVoltage: '5.0V' },
          { pin: 2, label: 'GND', type: 'GND', expectedVoltage: '0.0V' }
        ]
      },
      {
        id: 'R2',
        name: '4.7 kΩ 1/8W',
        type: 'Resistor',
        package: 'SMD 0805',
        confidence: 88,
        status: 'normal',
        ocrMarking: '472',
        description: 'Pull-up resistor for diagnostic enable line.',
        specs: {
          resistance: '4.7 kΩ',
          tolerance: '±1%',
          mounting: 'SMD'
        },
        bbox: { x: 44, y: 64, width: 8, height: 6 }
      },
      {
        id: 'R3',
        name: '10 kΩ 1/8W',
        type: 'Resistor',
        package: 'SMD 0805',
        confidence: 89,
        status: 'normal',
        ocrMarking: '103',
        description: 'Sense divider resistor for DC input voltage monitoring.',
        specs: {
          resistance: '10 kΩ',
          tolerance: '±1%',
          mounting: 'SMD'
        },
        bbox: { x: 32, y: 64, width: 8, height: 6 }
      },
      {
        id: 'Q1',
        name: 'IRF540N MOSFET',
        type: 'Transistor',
        package: 'TO-220AB',
        confidence: 91,
        status: 'issue',
        ocrMarking: 'IRF540N P714D',
        description: 'N-Channel Power MOSFET 100V 33A used in over-voltage crowbar cutoff circuit.',
        specs: {
          inputVoltage: 'Vdss 100V',
          ratedCurrent: 'Id 33A',
          resistance: 'Rds(on) 44mΩ',
          mounting: 'THT'
        },
        bbox: { x: 50, y: 56, width: 18, height: 24 },
        pins: [
          { pin: 1, label: 'GATE', type: 'IN', expectedVoltage: '0.0V - 10V' },
          { pin: 2, label: 'DRAIN', type: 'PWR', expectedVoltage: '12.0V' },
          { pin: 3, label: 'SOURCE', type: 'GND', expectedVoltage: '0.0V' }
        ],
        fault: {
          id: 'fault-q1',
          componentId: 'Q1',
          componentRef: 'Q1',
          title: 'Q1 — Solder Bridge & Thermal Discoloration Detected',
          severity: 'issue',
          confidence: 84,
          indicators: [
            'Possible solder bridge detected between Drain and Source lead pads (Pads 2 & 3)',
            'Discoloration around PCB FR4 substrate copper plane indicative of thermal overstress'
          ],
          recommendation: 'Check for electrical short circuit between Drain and Source using DMM continuity mode before powering up. Re-solder pads using flux and solder braid if bridged.',
          diagnosisStage: 'ai_suspicion',
          measurements: [
            {
              id: 'm3',
              testPoint: 'Q1 Drain to Source Resistance',
              type: 'resistance',
              expected: '> 100 kΩ (Unpowered)',
              measured: '0.2 Ω (Short Circuit)',
              unit: 'Ω',
              verified: true,
              status: 'failed'
            }
          ],
          notes: 'High severity: Shorted D-S bypasses crowbar cutoff and could drag down input rail.'
        }
      }
    ],
    metrics: {
      totalComponents: 12,
      icsCount: 1,
      resistorsCount: 3,
      capacitorsCount: 3,
      diodesCount: 2,
      otherCount: 3,
      warningsCount: 2,
      identifiedPercentage: 96,
      averageConfidence: 94.2,
      healthScore: 82
    }
  },
  {
    id: 'board-iot-02',
    name: 'Industrial ESP32 IoT Sensor Hub v1.4',
    boardCode: 'IOT-ESP32-SENS',
    layerCount: 4,
    dimensions: '65.0 x 48.0 mm',
    thumbnailColor: '#1e3a8a',
    uploadedAt: '2026-09-03 10:15:40',
    presetType: 'iot_mcu',
    components: [
      {
        id: 'U1',
        name: 'ESP32-WROOM-32E',
        type: 'IC',
        package: 'SMD-38 Module',
        confidence: 99,
        status: 'normal',
        ocrMarking: 'ESP-WROOM-32E Espressif',
        description: 'Wi-Fi (802.11 b/g/n) and Bluetooth v4.2 BR/EDR and BLE microcontroller module.',
        specs: {
          inputVoltage: '3.0V - 3.6V (3.3V Typ)',
          ratedCurrent: '500mA Peak during TX',
          operatingTemp: '-40°C to +85°C',
          mounting: 'SMD'
        },
        bbox: { x: 32, y: 16, width: 34, height: 42 }
      },
      {
        id: 'U2',
        name: 'AMS1117-3.3',
        type: 'Regulator',
        package: 'SOT-223',
        confidence: 98,
        status: 'normal',
        ocrMarking: 'AMS1117 3.3 H21',
        description: 'Low-dropout positive linear regulator dropping 5V USB VBUS to 3.3V for MCU.',
        specs: {
          inputVoltage: '4.75V - 12V',
          outputVoltage: '3.3V ± 1.5%',
          ratedCurrent: '1.0A Max',
          mounting: 'SMD'
        },
        bbox: { x: 14, y: 44, width: 14, height: 16 },
        datasheetId: 'ds-ams1117-33'
      },
      {
        id: 'U3',
        name: 'CP2102N',
        type: 'IC',
        package: 'QFN-28 (5x5mm)',
        confidence: 96,
        status: 'normal',
        ocrMarking: 'SILABS CP2102N',
        description: 'Single-chip USB-to-UART bridge controller with integrated USB transceiver.',
        specs: {
          inputVoltage: '3.0V - 3.6V VDD',
          mounting: 'SMD'
        },
        bbox: { x: 12, y: 18, width: 15, height: 18 }
      },
      {
        id: 'C3',
        name: '22µF 10V Tantalum',
        type: 'Capacitor',
        package: 'EIA 3528-21 (Case B)',
        confidence: 92,
        status: 'inspection',
        ocrMarking: '226 10V A',
        description: 'Output stabilizer capacitor for AMS1117-3.3 regulator.',
        specs: {
          capacitance: '22 µF',
          inputVoltage: '10V',
          mounting: 'SMD'
        },
        bbox: { x: 15, y: 64, width: 10, height: 8 },
        fault: {
          id: 'fault-c3',
          componentId: 'C3',
          componentRef: 'C3',
          title: 'C3 — Polarized Tantalum Alignment Inspection',
          severity: 'inspection',
          confidence: 76,
          indicators: [
            'Polarity line marking may be reversed relative to silkscreen "+" indicator',
            'Possible reversed insertion risk causing breakdown under reverse bias'
          ],
          recommendation: 'Verify cathode band alignment with silkscreen positive bar using optical microscope before applying USB 5V.',
          diagnosisStage: 'ai_suspicion',
          measurements: [
            {
              id: 'm_c3',
              testPoint: 'C3 Cathode to GND continuity',
              type: 'resistance',
              expected: 'Open / > 100kΩ',
              measured: 'Testing Pending',
              unit: 'Ω',
              verified: false,
              status: 'pending'
            }
          ]
        }
      }
    ],
    metrics: {
      totalComponents: 18,
      icsCount: 3,
      resistorsCount: 6,
      capacitorsCount: 5,
      diodesCount: 2,
      otherCount: 2,
      warningsCount: 1,
      identifiedPercentage: 98,
      averageConfidence: 96.1,
      healthScore: 91
    }
  },
  {
    id: 'board-motor-03',
    name: 'H-Bridge Stepper & DC Motor Driver Rev B',
    boardCode: 'MTR-L298-DUAL',
    layerCount: 2,
    dimensions: '72.0 x 55.0 mm',
    thumbnailColor: '#451a03',
    uploadedAt: '2026-09-02 18:45:00',
    presetType: 'motor_driver',
    components: [
      {
        id: 'U1',
        name: 'L298N',
        type: 'IC',
        package: 'Multiwatt-15',
        confidence: 99,
        status: 'normal',
        ocrMarking: 'L298N ST',
        description: 'Dual Full-Bridge Driver integrated monolithic circuit in 15-lead Multiwatt package.',
        specs: {
          inputVoltage: 'Up to 46V motor supply',
          ratedCurrent: '2A per channel (3A peak)',
          mounting: 'THT'
        },
        bbox: { x: 38, y: 15, width: 28, height: 35 }
      },
      {
        id: 'D1',
        name: 'SS14 Schottky',
        type: 'Diode',
        package: 'SMA (DO-214AC)',
        confidence: 94,
        status: 'normal',
        ocrMarking: 'SS14',
        description: 'Inductive kickback flyback clamping diode for Motor Channel A.',
        specs: {
          inputVoltage: '40V Vrrm',
          ratedCurrent: '1A If(av)',
          mounting: 'SMD'
        },
        bbox: { x: 22, y: 25, width: 8, height: 10 }
      },
      {
        id: 'D2',
        name: 'SS14 Schottky',
        type: 'Diode',
        package: 'SMA (DO-214AC)',
        confidence: 82,
        status: 'issue',
        ocrMarking: 'SS14 (Cracked)',
        description: 'Flyback diode channel B upper rail.',
        specs: {
          inputVoltage: '40V Vrrm',
          ratedCurrent: '1A',
          mounting: 'SMD'
        },
        bbox: { x: 70, y: 25, width: 8, height: 10 },
        fault: {
          id: 'fault-d2',
          componentId: 'D2',
          componentRef: 'D2',
          title: 'D2 — Package Fracture & Solder Cracking',
          severity: 'issue',
          confidence: 89,
          indicators: [
            'Hairline transverse mechanical crack visible across molded epoxy body',
            'Solder fillet cold joint / detachment on cathode terminal pad'
          ],
          recommendation: 'Replace diode D2 immediately before energizing inductive motor coil. A failed open flyback diode allows inductive spikes to exceed L298N breakdown voltage.',
          diagnosisStage: 'visual_inspection',
          measurements: [
            {
              id: 'm_d2',
              testPoint: 'D2 Diode Junction Test',
              type: 'diode',
              expected: '0.35V - 0.45V Forward Drop',
              measured: 'O.L (Open Circuit)',
              unit: 'V',
              verified: true,
              status: 'failed'
            }
          ]
        }
      }
    ],
    metrics: {
      totalComponents: 15,
      icsCount: 1,
      resistorsCount: 4,
      capacitorsCount: 2,
      diodesCount: 8,
      otherCount: 0,
      warningsCount: 1,
      identifiedPercentage: 94,
      averageConfidence: 91.5,
      healthScore: 84
    }
  }
];

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 'proj-101',
    name: 'Main Board #01 — 5V Regulated Power Supply',
    boardCode: 'PSU-7805-REV2',
    updatedAt: '2026-09-04 14:22',
    componentsCount: 12,
    warningsCount: 2,
    status: 'fault_flagged',
    board: MOCK_BOARDS[0],
    notes: 'Prototype unit #4. C14 top vent inspection required. Q1 D-S bridge needs reworking.'
  },
  {
    id: 'proj-102',
    name: 'Industrial ESP32 IoT Sensor Hub v1.4',
    boardCode: 'IOT-ESP32-SENS',
    updatedAt: '2026-09-03 10:15',
    componentsCount: 18,
    warningsCount: 1,
    status: 'in_progress',
    board: MOCK_BOARDS[1],
    notes: 'Pre-production run. Polarity check required on C3 tantalum capacitor.'
  },
  {
    id: 'proj-103',
    name: 'H-Bridge Stepper & DC Motor Driver Rev B',
    boardCode: 'MTR-L298-DUAL',
    updatedAt: '2026-09-02 18:45',
    componentsCount: 15,
    warningsCount: 1,
    status: 'fault_flagged',
    board: MOCK_BOARDS[2],
    notes: 'Return from field test bench. D2 flyback diode failure diagnosed.'
  }
];
