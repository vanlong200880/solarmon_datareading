'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseService2 = require('./BaseService');

var _BaseService3 = _interopRequireDefault(_BaseService2);

var _ModelSensorRT1Entity = require('../entities/ModelSensorRT1Entity');

var _ModelSensorRT1Entity2 = _interopRequireDefault(_ModelSensorRT1Entity);

var _ModelSensorIMTTaRS485Entity = require('../entities/ModelSensorIMTTaRS485Entity');

var _ModelSensorIMTTaRS485Entity2 = _interopRequireDefault(_ModelSensorIMTTaRS485Entity);

var _ModelSensorIMTSiRS485Entity = require('../entities/ModelSensorIMTSiRS485Entity');

var _ModelSensorIMTSiRS485Entity2 = _interopRequireDefault(_ModelSensorIMTSiRS485Entity);

var _ModelLoggerSMAIM20Entity = require('../entities/ModelLoggerSMAIM20Entity');

var _ModelLoggerSMAIM20Entity2 = _interopRequireDefault(_ModelLoggerSMAIM20Entity);

var _ModelInverterSungrowSG110CXEntity = require('../entities/ModelInverterSungrowSG110CXEntity');

var _ModelInverterSungrowSG110CXEntity2 = _interopRequireDefault(_ModelInverterSungrowSG110CXEntity);

var _ModelInverterSMASTP50Entity = require('../entities/ModelInverterSMASTP50Entity');

var _ModelInverterSMASTP50Entity2 = _interopRequireDefault(_ModelInverterSMASTP50Entity);

var _ModelInverterSMASHP75Entity = require('../entities/ModelInverterSMASHP75Entity');

var _ModelInverterSMASHP75Entity2 = _interopRequireDefault(_ModelInverterSMASHP75Entity);

var _ModelInverterGrowattGW80KTL3Entity = require('../entities/ModelInverterGrowattGW80KTL3Entity');

var _ModelInverterGrowattGW80KTL3Entity2 = _interopRequireDefault(_ModelInverterGrowattGW80KTL3Entity);

var _ModelInverterABBPVS100Entity = require('../entities/ModelInverterABBPVS100Entity');

var _ModelInverterABBPVS100Entity2 = _interopRequireDefault(_ModelInverterABBPVS100Entity);

var _ModelEmeterJanitzaUMG96S2Entity = require('../entities/ModelEmeterJanitzaUMG96S2Entity');

var _ModelEmeterJanitzaUMG96S2Entity2 = _interopRequireDefault(_ModelEmeterJanitzaUMG96S2Entity);

var _ModelTechedgeEntity = require('../entities/ModelTechedgeEntity');

var _ModelTechedgeEntity2 = _interopRequireDefault(_ModelTechedgeEntity);

var _ModelInverterSMASTP110Entity = require('../entities/ModelInverterSMASTP110Entity');

var _ModelInverterSMASTP110Entity2 = _interopRequireDefault(_ModelInverterSMASTP110Entity);

var _ModelEmeterVinasinoVSE3T5Entity = require('../entities/ModelEmeterVinasinoVSE3T5Entity');

var _ModelEmeterVinasinoVSE3T5Entity2 = _interopRequireDefault(_ModelEmeterVinasinoVSE3T5Entity);

var _ModelEmeterGelexEmicME41Entity = require('../entities/ModelEmeterGelexEmicME41Entity');

var _ModelEmeterGelexEmicME41Entity2 = _interopRequireDefault(_ModelEmeterGelexEmicME41Entity);

var _ModelEmeterVinasinoVSE3T52023Entity = require('../entities/ModelEmeterVinasinoVSE3T52023Entity');

var _ModelEmeterVinasinoVSE3T52023Entity2 = _interopRequireDefault(_ModelEmeterVinasinoVSE3T52023Entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataReadingsService = function (_BaseService) {
	_inherits(DataReadingsService, _BaseService);

	function DataReadingsService() {
		_classCallCheck(this, DataReadingsService);

		return _possibleConstructorReturn(this, (DataReadingsService.__proto__ || Object.getPrototypeOf(DataReadingsService)).call(this));
	}

	/**
  * @description Insert data
  * @author Long.Pham
  * @since 10/09/2021
  * @param {Object model} data
  */


	_createClass(DataReadingsService, [{
		key: 'insertDataReadings',
		value: function insertDataReadings(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var dataPayload = data.payload;
						if (!Libs.isObjectEmpty(dataPayload)) {
							Object.keys(dataPayload).forEach(function (el) {
								dataPayload[el] = dataPayload[el] == '\x00' || dataPayload[el] == '' ? null : dataPayload[el];
							});
						}

						var getDeviceInfo = await db.queryForObject("ModelReadings.getDeviceInfo", data);
						if (Libs.isObjectEmpty(dataPayload) || !getDeviceInfo || Libs.isObjectEmpty(getDeviceInfo) || Libs.isBlank(getDeviceInfo.table_name) || Libs.isBlank(getDeviceInfo.id)) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						var dataEntity = {},
						    rs = {},
						    checkExistAlerm = null;
						switch (getDeviceInfo.table_name) {

							case 'model_emeter_GelexEmic_ME41':
								dataEntity = Object.assign({}, new _ModelEmeterGelexEmicME41Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								dataEntity.activeEnergy = dataEntity.activeEnergyExport;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 649
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 649,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
										dataEntity.activeEnergyExport = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 649,
											status: 0
										});
									}
								}

								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelEmeterGelexEmicME41", dataEntity);
									// Update device 
									if (rs) {
										var lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (lastRowDataUpdated) {
											var deviceUpdated = {
												id: getDeviceInfo.id,
												power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
												energy_today: lastRowDataUpdated.energy_today,
												last_month: lastRowDataUpdated.energy_last_month,
												lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
										}
									}
								}

								break;

							case 'model_emeter_Vinasino_VSE3T5':
								dataEntity = Object.assign({}, new _ModelEmeterVinasinoVSE3T5Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 626
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 626,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 626,
											status: 0
										});
									}
								}

								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T5", dataEntity);
									// Update device 
									if (rs) {
										var _lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (_lastRowDataUpdated) {
											var _deviceUpdated = {
												id: getDeviceInfo.id,
												power_now: _lastRowDataUpdated.activePower ? _lastRowDataUpdated.activePower : null,
												energy_today: _lastRowDataUpdated.energy_today,
												last_month: _lastRowDataUpdated.energy_last_month,
												lifetime: _lastRowDataUpdated.activeEnergy ? _lastRowDataUpdated.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", _deviceUpdated);
										}
									}
								}

								break;

							case 'model_emeter_Vinasino_VSE3T52023':
								dataEntity = Object.assign({}, new _ModelEmeterVinasinoVSE3T52023Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 663
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 663,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 663,
											status: 0
										});
									}
								}

								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T52023", dataEntity);
									// Update device 
									if (rs) {
										var _lastRowDataUpdated2 = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (_lastRowDataUpdated2) {
											var _deviceUpdated2 = {
												id: getDeviceInfo.id,
												power_now: _lastRowDataUpdated2.activePower ? _lastRowDataUpdated2.activePower : null,
												energy_today: _lastRowDataUpdated2.energy_today,
												last_month: _lastRowDataUpdated2.energy_last_month,
												lifetime: _lastRowDataUpdated2.activeEnergy ? _lastRowDataUpdated2.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", _deviceUpdated2);
										}
									}
								}

								break;

							case 'model_inverter_SMA_STP110':
								dataEntity = Object.assign({}, new _ModelInverterSMASTP110Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 437
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 437,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 437,
											status: 0
										});
									}
								}

								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelInverterSMASTP110", dataEntity);
									// Update device 
									if (rs) {
										var _lastRowDataUpdated3 = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (_lastRowDataUpdated3) {
											var _deviceUpdated3 = {
												id: getDeviceInfo.id,
												power_now: _lastRowDataUpdated3.activePower ? _lastRowDataUpdated3.activePower : null,
												energy_today: _lastRowDataUpdated3.energy_today,
												last_month: _lastRowDataUpdated3.energy_last_month,
												lifetime: _lastRowDataUpdated3.activeEnergy ? _lastRowDataUpdated3.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", _deviceUpdated3);
										}
									}
								}

								break;

							case 'model_inverter_ABB_PVS100':
								dataEntity = Object.assign({}, new _ModelInverterABBPVS100Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 428
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 428,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 428,
											status: 0
										});
									}
								}

								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelInverterABBPVS100", dataEntity);
									// Update device 
									if (rs) {
										var _lastRowDataUpdated4 = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (_lastRowDataUpdated4) {
											var _deviceUpdated4 = {
												id: getDeviceInfo.id,
												power_now: _lastRowDataUpdated4.activePower ? _lastRowDataUpdated4.activePower : null,
												energy_today: _lastRowDataUpdated4.energy_today,
												last_month: _lastRowDataUpdated4.energy_last_month,
												lifetime: _lastRowDataUpdated4.activeEnergy ? _lastRowDataUpdated4.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", _deviceUpdated4);
										}
									}
								}

								break;
							case 'model_sensor_RT1':
								dataEntity = Object.assign({}, new _ModelSensorRT1Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 432
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 432,
											start_date: data.timestamp,
											status: 1
										});
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 432,
											status: 0
										});
									}
								}

								rs = await db.insert("ModelReadings.insertModelSensorRT1", dataEntity);
								if (rs) {
									// Update device 
									var _deviceUpdated5 = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
									db.update("ModelReadings.updatedDevicePlant", _deviceUpdated5);
								}
								break;

							case 'model_techedge':
								dataEntity = Object.assign({}, new _ModelTechedgeEntity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 435
								});
								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 435,
											start_date: data.timestamp,
											status: 1
										});
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 435,
											status: 0
										});
									}
								}

								rs = await db.insert("ModelReadings.insertModelTechedge", dataEntity);
								if (rs) {
									// Update device 
									var _deviceUpdated6 = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
									db.update("ModelReadings.updatedDevicePlant", _deviceUpdated6);
								}
								break;

							case 'model_sensor_IMT_TaRS485':
								dataEntity = Object.assign({}, new _ModelSensorIMTTaRS485Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 434
								});
								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 434,
											start_date: data.timestamp,
											status: 1
										});
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 434,
											status: 0
										});
									}
								}

								rs = await db.insert("ModelReadings.insertModelSensorIMTTaRS485", dataEntity);
								if (rs) {
									// Update device 
									var _deviceUpdated7 = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
									db.update("ModelReadings.updatedDevicePlant", _deviceUpdated7);
								}
								break;
							case 'model_sensor_IMT_SiRS485':
								dataEntity = Object.assign({}, new _ModelSensorIMTSiRS485Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 433
								});
								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 433,
											start_date: data.timestamp,
											status: 1
										});
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 433,
											status: 0
										});
									}
								}

								rs = await db.insert("ModelReadings.insertModelSensorIMTSiRS485", dataEntity);
								if (rs) {
									// Update device 
									var _deviceUpdated8 = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
									db.update("ModelReadings.updatedDevicePlant", _deviceUpdated8);
								}
								break;
							case 'model_logger_SMA_IM20':
								dataEntity = Object.assign({}, new _ModelLoggerSMAIM20Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 431
								});
								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 431,
											start_date: data.timestamp,
											status: 1
										});
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 431,
											status: 0
										});
									}
								}

								rs = await db.insert("ModelReadings.insertModelLoggerSMAIM20", dataEntity);
								if (rs) {
									// Update device 
									var _deviceUpdated9 = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
									db.update("ModelReadings.updatedDevicePlant", _deviceUpdated9);
								}
								break;
							case 'model_inverter_Sungrow_SG110CX':
								break;
							case 'model_inverter_SMA_STP50':
								dataEntity = Object.assign({}, new _ModelInverterSMASTP50Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 430
								});
								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 430,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.view_table
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 430,
											status: 0
										});
									}
								}

								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelInverterSMASTP50", dataEntity);
									// Update device 
									if (rs) {
										var _lastRowDataUpdated5 = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (_lastRowDataUpdated5) {
											var _deviceUpdated10 = {
												id: getDeviceInfo.id,
												power_now: _lastRowDataUpdated5.activePower ? _lastRowDataUpdated5.activePower : null,
												energy_today: _lastRowDataUpdated5.energy_today,
												last_month: _lastRowDataUpdated5.energy_last_month,
												lifetime: _lastRowDataUpdated5.activeEnergy ? _lastRowDataUpdated5.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", _deviceUpdated10);
										}
									}
								}

								break;
							case 'model_inverter_SMA_SHP75':
								dataEntity = Object.assign({}, new _ModelInverterSMASHP75Entity2.default(), dataPayload);
								dataEntity.time = data.timestamp;
								dataEntity.id_device = getDeviceInfo.id;
								// Check status DISCONNECTED
								checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
									id_device: getDeviceInfo.id,
									id_error: 429
								});

								if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
									// Insert alert error system disconnected
									if (!checkExistAlerm) {
										rs = await db.insert("ModelReadings.insertAlert", {
											id_device: getDeviceInfo.id,
											id_error: 429,
											start_date: data.timestamp,
											status: 1
										});
									}

									// Get last row by device 
									var lastRow = await db.queryForObject("ModelReadings.getLastRowData", {
										id_device: getDeviceInfo.id,
										table_name: getDeviceInfo.table_name
									});
									if (lastRow) {
										dataEntity.activeEnergy = lastRow.activeEnergy;
									}
								} else {
									// close alarm 
									if (checkExistAlerm) {
										await db.delete("ModelReadings.closeAlarmDisconnected", {
											id: checkExistAlerm.id,
											id_device: getDeviceInfo.id,
											id_error: 429,
											status: 0
										});
									}
								}
								if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
									rs = await db.insert("ModelReadings.insertModelInverterSMASHP75", dataEntity);
									// Update device 
									if (rs) {
										var _lastRowDataUpdated6 = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.view_table
										});
										if (_lastRowDataUpdated6) {
											var _deviceUpdated11 = {
												id: getDeviceInfo.id,
												power_now: _lastRowDataUpdated6.activePower ? _lastRowDataUpdated6.activePower : null,
												energy_today: _lastRowDataUpdated6.energy_today,
												last_month: _lastRowDataUpdated6.energy_last_month,
												lifetime: _lastRowDataUpdated6.activeEnergy ? _lastRowDataUpdated6.activeEnergy : null,
												last_updated: dataEntity.time
											};
											db.update("ModelReadings.updatedDevicePlant", _deviceUpdated11);
										}
									}
								}

								break;
							case 'model_inverter_Growatt_GW80KTL3':
								break;
							case 'model_emeter_Janitza_UMG96S2':
								// dataEntity = Object.assign({}, new ModelEmeterJanitzaUMG96S2Entity(), dataPayload);
								// dataEntity.time = data.timestamp;
								// dataEntity.id_device = getDeviceInfo.id;
								// // Check status DISCONNECTED
								// checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
								// 	id_device: getDeviceInfo.id,
								// 	id_error: 427
								// });
								// if (!Libs.isBlank(data.status) && data.status == 'DISCONNECTED') {
								// 	// Insert alert error system disconnected
								// 	if (!checkExistAlerm) {
								// 		rs = await db.insert("ModelReadings.insertAlert", {
								// 			id_device: getDeviceInfo.id,
								// 			id_error: 427,
								// 			start_date: data.timestamp,
								// 			status: 1
								// 		});
								// 	}
								// } else {
								// 	// close alarm 
								// 	if (checkExistAlerm) {
								// 		await db.delete("ModelReadings.closeAlarmDisconnected", {
								// 			id: checkExistAlerm.id,
								// 			id_device: getDeviceInfo.id,
								// 			id_error: 427,
								// 			status: 0
								// 		});
								// 	}
								// }

								// rs = await db.insert("ModelReadings.insertModelEmeterJanitzaUMG96S2", dataEntity);
								break;
						}

						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						conn.commit();
						callBack(true, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(false, err);
					}
				});
			} catch (e) {
				console.log('error', e);
				callBack(false, e);
			}
		}

		/**
   * @description Insert alarm
   * @author Long.Pham
   * @since 12/09/2021
   * @param {Object model} data
   */

	}, {
		key: 'insertAlarmReadings',
		value: function insertAlarmReadings(data, callBack) {
			try {
				var db = new mySqLDB();
				db.beginTransaction(async function (conn) {
					try {
						var getDeviceInfo = await db.queryForObject("ModelReadings.getDeviceInfo", data);
						if (!getDeviceInfo || Libs.isObjectEmpty(getDeviceInfo) || Libs.isBlank(getDeviceInfo.table_name) || Libs.isBlank(getDeviceInfo.id)) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						var rs = {},
						    checkExistAlerm = null;
						var devStatus = data.devStatus;
						var devEvent = data.devEvent;

						// Check status 
						if (!Libs.isObjectEmpty(devStatus)) {
							switch (getDeviceInfo.table_name) {
								// sent error code 
								case 'model_inverter_SMA_STP110':
								case 'model_inverter_SMA_SHP75':
								case 'model_inverter_ABB_PVS100':
								case 'model_inverter_SMA_STP50':
									// check status 1
									if (devStatus.hasOwnProperty("status1") && !Libs.isBlank(devStatus.status1)) {
										// get error id
										var objParams = { state_key: 'status1', error_code: devStatus.status1 };
										var objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
										if (objError) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var dataAlertSentMail = {
														error_code: objError.error_code,
														description: objError.description,
														message: objError.message,
														solutions: objError.solutions,
														error_type_name: objError.error_type_name,
														error_level_name: objError.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var html = reportRender.render("alert/mail_alert", dataAlertSentMail);
													SentMail.SentMailHTML(null, dataAlertSentMail.email, 'Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name, html);
												}
											}
										}
									}

									// check status 2
									if (devStatus.hasOwnProperty("status2") && !Libs.isBlank(devStatus.status2)) {
										// get error id
										var _objParams = { state_key: 'status2', error_code: devStatus.status2 };
										var _objError = await db.queryForObject("ModelReadings.getErrorInfo", _objParams);
										if (_objError) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError.id_error_level) && _objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail = {
														error_code: _objError.error_code,
														description: _objError.description,
														message: _objError.message,
														solutions: _objError.solutions,
														error_type_name: _objError.error_type_name,
														error_level_name: _objError.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html = reportRender.render("alert/mail_alert", _dataAlertSentMail);
													SentMail.SentMailHTML(null, _dataAlertSentMail.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail.project_name, _html);
												}
											}
										}
									}

									// check status 3
									if (devStatus.hasOwnProperty("status3") && !Libs.isBlank(devStatus.status3)) {
										// get error id
										var _objParams2 = { state_key: 'status3', error_code: devStatus.status3 };
										var _objError2 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams2);
										if (_objError2) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError2.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError2.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError2.id_error_level) && _objError2.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail2 = {
														error_code: _objError2.error_code,
														description: _objError2.description,
														message: _objError2.message,
														solutions: _objError2.solutions,
														error_type_name: _objError2.error_type_name,
														error_level_name: _objError2.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html2 = reportRender.render("alert/mail_alert", _dataAlertSentMail2);
													SentMail.SentMailHTML(null, _dataAlertSentMail2.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail2.project_name, _html2);
												}
											}
										}
									}
									break;

								// case 'model_inverter_Sungrow_SG110CX':
								// 	break;

								// Sent error bit
								// case 'model_sensor_RT1':
								// 	break;

								// case 'model_sensor_IMT_SiRS485':
								// 	break;

								// case 'model_sensor_IMT_TaRS485':
								// 	break;

								// case '':
								// 	break;
								// case 'model_techedge':
								// 	break;

								// case 'model_inverter_Growatt_GW80KTL3':
								// 	break;
							}

							// check status 4
							// if (devStatus.hasOwnProperty("status4") && !Libs.isBlank(devStatus.status4)) {
							// 	// get error id
							// 	let objParams = { state_key: 'status4', error_code: devStatus.status4 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }

							// // check status 5
							// if (devStatus.hasOwnProperty("status5") && !Libs.isBlank(devStatus.status5)) {
							// 	// get error id
							// 	let objParams = { state_key: 'status5', error_code: devStatus.status5 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }


							// // check status 6
							// if (devStatus.hasOwnProperty("status6") && !Libs.isBlank(devStatus.status6)) {
							// 	// get error id
							// 	let objParams = { state_key: 'status6', error_code: devStatus.status6 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});
							// 		}
							// 	}
							// }


							// // check status 7
							// if (devStatus.hasOwnProperty("status7") && !Libs.isBlank(devStatus.status7)) {
							// 	// get error id
							// 	let objParams = { state_key: 'status7', error_code: devStatus.status7 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }
						}

						// Check event 
						if (!Libs.isObjectEmpty(devEvent)) {
							switch (getDeviceInfo.table_name) {
								// sent error code 
								case 'model_inverter_SMA_STP50':
									// check event 1
									if (devEvent.hasOwnProperty("event1") && !Libs.isBlank(devEvent.event1)) {
										// get error id
										var _objParams3 = { state_key: 'event1', error_code: devEvent.event1 };
										var _objError3 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams3);
										if (_objError3) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError3.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError3.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError3.id_error_level) && _objError3.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail3 = {
														error_code: _objError3.error_code,
														description: _objError3.description,
														message: _objError3.message,
														solutions: _objError3.solutions,
														error_type_name: _objError3.error_type_name,
														error_level_name: _objError3.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html3 = reportRender.render("alert/mail_alert", _dataAlertSentMail3);
													SentMail.SentMailHTML(null, _dataAlertSentMail3.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail3.project_name, _html3);
												}
											}
										}
									}

									// check event 2
									if (devEvent.hasOwnProperty("event2") && !Libs.isBlank(devEvent.event2)) {
										// get error id
										var _objParams4 = { state_key: 'event2', error_code: devEvent.event2 };
										var _objError4 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams4);
										if (_objError4) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError4.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError4.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError4.id_error_level) && _objError4.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail4 = {
														error_code: _objError4.error_code,
														description: _objError4.description,
														message: _objError4.message,
														solutions: _objError4.solutions,
														error_type_name: _objError4.error_type_name,
														error_level_name: _objError4.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html4 = reportRender.render("alert/mail_alert", _dataAlertSentMail4);
													SentMail.SentMailHTML(null, _dataAlertSentMail4.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail4.project_name, _html4);
												}
											}
										}
									}

									// check event 3
									if (devEvent.hasOwnProperty("event3") && !Libs.isBlank(devEvent.event3)) {
										// get error id
										var _objParams5 = { state_key: 'event3', error_code: devEvent.event3 };
										var _objError5 = await db.queryForObject("ModelReadings.getErrorInfo", _objParams5);
										if (_objError5) {
											// check alert exists
											checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: _objError5.id });
											if (!checkExistAlerm) {
												// Insert alert
												rs = await db.insert("ModelReadings.insertAlert", {
													id_device: getDeviceInfo.id, id_error: _objError5.id, start_date: data.timestamp, status: 1
												});

												//  Check sent mail
												if (!Libs.isBlank(_objError5.id_error_level) && _objError5.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
													var _dataAlertSentMail5 = {
														error_code: _objError5.error_code,
														description: _objError5.description,
														message: _objError5.message,
														solutions: _objError5.solutions,
														error_type_name: _objError5.error_type_name,
														error_level_name: _objError5.error_level_name,
														device_name: getDeviceInfo.name,
														project_name: getDeviceInfo.project_name,
														full_name: getDeviceInfo.full_name,
														email: getDeviceInfo.email,
														error_date: getDeviceInfo.error_date
													};
													var _html5 = reportRender.render("alert/mail_alert", _dataAlertSentMail5);
													SentMail.SentMailHTML(null, _dataAlertSentMail5.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail5.project_name, _html5);
												}
											}
										}
									}
									break;

								// Sent bit code
								case 'model_inverter_SMA_STP110':
								case 'model_inverter_ABB_PVS100':
								case 'model_inverter_SMA_SHP75':
									// check event 1
									if (devEvent.hasOwnProperty("event1") && !Libs.isBlank(devEvent.event1)) {
										var arrErrorCode1 = Libs.decimalToErrorCode(devEvent.event1);
										if (arrErrorCode1.length > 0) {
											var paramBit1 = {
												state_key: 'event1',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode1
											};

											// Lay danh sach loi tren he thong
											var arrError = await db.queryForList("ModelReadings.getListError", paramBit1);
											if (arrError.length > 0) {
												for (var i = 0; i < arrError.length; i++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: arrError[i].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: arrError[i].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(arrError[i].id_error_level) && arrError[i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail6 = {
																error_code: arrError[i].error_code,
																description: arrError[i].description,
																message: arrError[i].message,
																solutions: arrError[i].solutions,
																error_type_name: arrError[i].error_type_name,
																error_level_name: arrError[i].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html6 = reportRender.render("alert/mail_alert", _dataAlertSentMail6);
															SentMail.SentMailHTML(null, _dataAlertSentMail6.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail6.project_name, _html6);
														}
													}
												}
											}
										}
									}

									// check event 2
									if (devEvent.hasOwnProperty("event2") && !Libs.isBlank(devEvent.event2)) {
										var arrErrorCode2 = Libs.decimalToErrorCode(devEvent.event2);
										if (arrErrorCode2.length > 0) {
											var paramBit2 = {
												state_key: 'event2',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode2
											};

											// Lay danh sach loi tren he thong
											var _arrError = await db.queryForList("ModelReadings.getListError", paramBit2);
											if (_arrError.length > 0) {
												for (var _i = 0; _i < _arrError.length; _i++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError[_i].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError[_i].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError[_i].id_error_level) && _arrError[_i].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail7 = {
																error_code: _arrError[_i].error_code,
																description: _arrError[_i].description,
																message: _arrError[_i].message,
																solutions: _arrError[_i].solutions,
																error_type_name: _arrError[_i].error_type_name,
																error_level_name: _arrError[_i].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html7 = reportRender.render("alert/mail_alert", _dataAlertSentMail7);
															SentMail.SentMailHTML(null, _dataAlertSentMail7.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail7.project_name, _html7);
														}
													}
												}
											}
										}
									}

									// check event 3
									if (devEvent.hasOwnProperty("event3") && !Libs.isBlank(devEvent.event3)) {
										var arrErrorCode3 = Libs.decimalToErrorCode(devEvent.event3);
										if (arrErrorCode3.length > 0) {
											var paramBit3 = {
												state_key: 'event3',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode3
											};

											// Lay danh sach loi tren he thong
											var _arrError2 = await db.queryForList("ModelReadings.getListError", paramBit3);
											if (_arrError2.length > 0) {
												for (var _i2 = 0; _i2 < _arrError2.length; _i2++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError2[_i2].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError2[_i2].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError2[_i2].id_error_level) && _arrError2[_i2].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail8 = {
																error_code: _arrError2[_i2].error_code,
																description: _arrError2[_i2].description,
																message: _arrError2[_i2].message,
																solutions: _arrError2[_i2].solutions,
																error_type_name: _arrError2[_i2].error_type_name,
																error_level_name: _arrError2[_i2].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html8 = reportRender.render("alert/mail_alert", _dataAlertSentMail8);
															SentMail.SentMailHTML(null, _dataAlertSentMail8.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail8.project_name, _html8);
														}
													}
												}
											}
										}
									}

									// check event 4
									if (devEvent.hasOwnProperty("event4") && !Libs.isBlank(devEvent.event4)) {
										var arrErrorCode4 = Libs.decimalToErrorCode(devEvent.event4);
										if (arrErrorCode4.length > 0) {
											var paramBit4 = {
												state_key: 'event4',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode4
											};

											// Lay danh sach loi tren he thong
											var _arrError3 = await db.queryForList("ModelReadings.getListError", paramBit4);
											if (_arrError3.length > 0) {
												for (var _i3 = 0; _i3 < _arrError3.length; _i3++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError3[_i3].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError3[_i3].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError3[_i3].id_error_level) && _arrError3[_i3].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail9 = {
																error_code: _arrError3[_i3].error_code,
																description: _arrError3[_i3].description,
																message: _arrError3[_i3].message,
																solutions: _arrError3[_i3].solutions,
																error_type_name: _arrError3[_i3].error_type_name,
																error_level_name: _arrError3[_i3].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html9 = reportRender.render("alert/mail_alert", _dataAlertSentMail9);
															SentMail.SentMailHTML(null, _dataAlertSentMail9.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail9.project_name, _html9);
														}
													}
												}
											}
										}
									}

									// check event 5
									if (devEvent.hasOwnProperty("event5") && !Libs.isBlank(devEvent.event5)) {
										var arrErrorCode5 = Libs.decimalToErrorCode(devEvent.event5);
										if (arrErrorCode5.length > 0) {
											var paramBit5 = {
												state_key: 'event5',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode5
											};

											// Lay danh sach loi tren he thong
											var _arrError4 = await db.queryForList("ModelReadings.getListError", paramBit5);
											if (_arrError4.length > 0) {
												for (var _i4 = 0; _i4 < _arrError4.length; _i4++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError4[_i4].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError4[_i4].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError4[_i4].id_error_level) && _arrError4[_i4].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail10 = {
																error_code: _arrError4[_i4].error_code,
																description: _arrError4[_i4].description,
																message: _arrError4[_i4].message,
																solutions: _arrError4[_i4].solutions,
																error_type_name: _arrError4[_i4].error_type_name,
																error_level_name: _arrError4[_i4].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html10 = reportRender.render("alert/mail_alert", _dataAlertSentMail10);
															SentMail.SentMailHTML(null, _dataAlertSentMail10.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail10.project_name, _html10);
														}
													}
												}
											}
										}
									}

									// check event 6
									if (devEvent.hasOwnProperty("event6") && !Libs.isBlank(devEvent.event6)) {
										var arrErrorCode6 = Libs.decimalToErrorCode(devEvent.event6);
										if (arrErrorCode6.length > 0) {
											var paramBit6 = {
												state_key: 'event6',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode6
											};

											// Lay danh sach loi tren he thong
											var _arrError5 = await db.queryForList("ModelReadings.getListError", paramBit6);
											if (_arrError5.length > 0) {
												for (var _i5 = 0; _i5 < _arrError5.length; _i5++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError5[_i5].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError5[_i5].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError5[_i5].id_error_level) && _arrError5[_i5].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail11 = {
																error_code: _arrError5[_i5].error_code,
																description: _arrError5[_i5].description,
																message: _arrError5[_i5].message,
																solutions: _arrError5[_i5].solutions,
																error_type_name: _arrError5[_i5].error_type_name,
																error_level_name: _arrError5[_i5].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html11 = reportRender.render("alert/mail_alert", _dataAlertSentMail11);
															SentMail.SentMailHTML(null, _dataAlertSentMail11.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail11.project_name, _html11);
														}
													}
												}
											}
										}
									}

									// check event 7
									if (devEvent.hasOwnProperty("event7") && !Libs.isBlank(devEvent.event7)) {
										var arrErrorCode7 = Libs.decimalToErrorCode(devEvent.event7);
										if (arrErrorCode7.length > 0) {
											var paramBit7 = {
												state_key: 'event7',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode7
											};

											// Lay danh sach loi tren he thong
											var _arrError6 = await db.queryForList("ModelReadings.getListError", paramBit7);
											if (_arrError6.length > 0) {
												for (var _i6 = 0; _i6 < _arrError6.length; _i6++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError6[_i6].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError6[_i6].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError6[_i6].id_error_level) && _arrError6[_i6].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail12 = {
																error_code: _arrError6[_i6].error_code,
																description: _arrError6[_i6].description,
																message: _arrError6[_i6].message,
																solutions: _arrError6[_i6].solutions,
																error_type_name: _arrError6[_i6].error_type_name,
																error_level_name: _arrError6[_i6].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html12 = reportRender.render("alert/mail_alert", _dataAlertSentMail12);
															SentMail.SentMailHTML(null, _dataAlertSentMail12.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail12.project_name, _html12);
														}
													}
												}
											}
										}
									}

									// check event 8
									if (devEvent.hasOwnProperty("event8") && !Libs.isBlank(devEvent.event8)) {
										var arrErrorCode8 = Libs.decimalToErrorCode(devEvent.event8);
										if (arrErrorCode8.length > 0) {
											var paramBit8 = {
												state_key: 'event8',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode8
											};

											// Lay danh sach loi tren he thong
											var _arrError7 = await db.queryForList("ModelReadings.getListError", paramBit8);
											if (_arrError7.length > 0) {
												for (var _i7 = 0; _i7 < _arrError7.length; _i7++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError7[_i7].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError7[_i7].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError7[_i7].id_error_level) && _arrError7[_i7].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail13 = {
																error_code: _arrError7[_i7].error_code,
																description: _arrError7[_i7].description,
																message: _arrError7[_i7].message,
																solutions: _arrError7[_i7].solutions,
																error_type_name: _arrError7[_i7].error_type_name,
																error_level_name: _arrError7[_i7].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html13 = reportRender.render("alert/mail_alert", _dataAlertSentMail13);
															SentMail.SentMailHTML(null, _dataAlertSentMail13.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail13.project_name, _html13);
														}
													}
												}
											}
										}
									}

									// check event 9
									if (devEvent.hasOwnProperty("event9") && !Libs.isBlank(devEvent.event9)) {
										var arrErrorCode9 = Libs.decimalToErrorCode(devEvent.event9);
										if (arrErrorCode9.length > 0) {
											var paramBit9 = {
												state_key: 'event9',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode9
											};

											// Lay danh sach loi tren he thong
											var _arrError8 = await db.queryForList("ModelReadings.getListError", paramBit9);
											if (_arrError8.length > 0) {
												for (var _i8 = 0; _i8 < _arrError8.length; _i8++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError8[_i8].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError8[_i8].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError8[_i8].id_error_level) && _arrError8[_i8].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail14 = {
																error_code: _arrError8[_i8].error_code,
																description: _arrError8[_i8].description,
																message: _arrError8[_i8].message,
																solutions: _arrError8[_i8].solutions,
																error_type_name: _arrError8[_i8].error_type_name,
																error_level_name: _arrError8[_i8].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html14 = reportRender.render("alert/mail_alert", _dataAlertSentMail14);
															SentMail.SentMailHTML(null, _dataAlertSentMail14.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail14.project_name, _html14);
														}
													}
												}
											}
										}
									}

									// check event 10
									if (devEvent.hasOwnProperty("event10") && !Libs.isBlank(devEvent.event10)) {
										var arrErrorCode10 = Libs.decimalToErrorCode(devEvent.event10);
										if (arrErrorCode10.length > 0) {
											var paramBit10 = {
												state_key: 'event10',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode10
											};

											// Lay danh sach loi tren he thong
											var _arrError9 = await db.queryForList("ModelReadings.getListError", paramBit10);
											if (_arrError9.length > 0) {
												for (var _i9 = 0; _i9 < _arrError9.length; _i9++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError9[_i9].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError9[_i9].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError9[_i9].id_error_level) && _arrError9[_i9].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail15 = {
																error_code: _arrError9[_i9].error_code,
																description: _arrError9[_i9].description,
																message: _arrError9[_i9].message,
																solutions: _arrError9[_i9].solutions,
																error_type_name: _arrError9[_i9].error_type_name,
																error_level_name: _arrError9[_i9].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html15 = reportRender.render("alert/mail_alert", _dataAlertSentMail15);
															SentMail.SentMailHTML(null, _dataAlertSentMail15.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail15.project_name, _html15);
														}
													}
												}
											}
										}
									}

									// check event 11
									if (devEvent.hasOwnProperty("event11") && !Libs.isBlank(devEvent.event11)) {
										var arrErrorCode11 = Libs.decimalToErrorCode(devEvent.event11);
										if (arrErrorCode11.length > 0) {
											var paramBit11 = {
												state_key: 'event11',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode11
											};

											// Lay danh sach loi tren he thong
											var _arrError10 = await db.queryForList("ModelReadings.getListError", paramBit11);
											if (_arrError10.length > 0) {
												for (var _i10 = 0; _i10 < _arrError10.length; _i10++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError10[_i10].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError10[_i10].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError10[_i10].id_error_level) && _arrError10[_i10].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail16 = {
																error_code: _arrError10[_i10].error_code,
																description: _arrError10[_i10].description,
																message: _arrError10[_i10].message,
																solutions: _arrError10[_i10].solutions,
																error_type_name: _arrError10[_i10].error_type_name,
																error_level_name: _arrError10[_i10].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html16 = reportRender.render("alert/mail_alert", _dataAlertSentMail16);
															SentMail.SentMailHTML(null, _dataAlertSentMail16.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail16.project_name, _html16);
														}
													}
												}
											}
										}
									}

									// check event 12
									if (devEvent.hasOwnProperty("event12") && !Libs.isBlank(devEvent.event12)) {
										var arrErrorCode12 = Libs.decimalToErrorCode(devEvent.event12);
										if (arrErrorCode12.length > 0) {
											var paramBit12 = {
												state_key: 'event12',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode12
											};

											// Lay danh sach loi tren he thong
											var _arrError11 = await db.queryForList("ModelReadings.getListError", paramBit12);
											if (_arrError11.length > 0) {
												for (var _i11 = 0; _i11 < _arrError11.length; _i11++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError11[_i11].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError11[_i11].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError11[_i11].id_error_level) && _arrError11[_i11].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail17 = {
																error_code: _arrError11[_i11].error_code,
																description: _arrError11[_i11].description,
																message: _arrError11[_i11].message,
																solutions: _arrError11[_i11].solutions,
																error_type_name: _arrError11[_i11].error_type_name,
																error_level_name: _arrError11[_i11].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html17 = reportRender.render("alert/mail_alert", _dataAlertSentMail17);
															SentMail.SentMailHTML(null, _dataAlertSentMail17.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail17.project_name, _html17);
														}
													}
												}
											}
										}
									}

									// check event 13
									if (devEvent.hasOwnProperty("event13") && !Libs.isBlank(devEvent.event13)) {
										var arrErrorCode13 = Libs.decimalToErrorCode(devEvent.event13);
										if (arrErrorCode13.length > 0) {
											var paramBit13 = {
												state_key: 'event13',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode13
											};

											// Lay danh sach loi tren he thong
											var _arrError12 = await db.queryForList("ModelReadings.getListError", paramBit13);
											if (_arrError12.length > 0) {
												for (var _i12 = 0; _i12 < _arrError12.length; _i12++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError12[_i12].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError12[_i12].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError12[_i12].id_error_level) && _arrError12[_i12].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail18 = {
																error_code: _arrError12[_i12].error_code,
																description: _arrError12[_i12].description,
																message: _arrError12[_i12].message,
																solutions: _arrError12[_i12].solutions,
																error_type_name: _arrError12[_i12].error_type_name,
																error_level_name: _arrError12[_i12].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html18 = reportRender.render("alert/mail_alert", _dataAlertSentMail18);
															SentMail.SentMailHTML(null, _dataAlertSentMail18.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail18.project_name, _html18);
														}
													}
												}
											}
										}
									}

									// check event 14
									if (devEvent.hasOwnProperty("event14") && !Libs.isBlank(devEvent.event14)) {
										var arrErrorCode14 = Libs.decimalToErrorCode(devEvent.event14);
										if (arrErrorCode14.length > 0) {
											var paramBit14 = {
												state_key: 'event14',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode14
											};

											// Lay danh sach loi tren he thong
											var _arrError13 = await db.queryForList("ModelReadings.getListError", paramBit14);
											if (_arrError13.length > 0) {
												for (var _i13 = 0; _i13 < _arrError13.length; _i13++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError13[_i13].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError13[_i13].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError13[_i13].id_error_level) && _arrError13[_i13].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail19 = {
																error_code: _arrError13[_i13].error_code,
																description: _arrError13[_i13].description,
																message: _arrError13[_i13].message,
																solutions: _arrError13[_i13].solutions,
																error_type_name: _arrError13[_i13].error_type_name,
																error_level_name: _arrError13[_i13].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html19 = reportRender.render("alert/mail_alert", _dataAlertSentMail19);
															SentMail.SentMailHTML(null, _dataAlertSentMail19.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail19.project_name, _html19);
														}
													}
												}
											}
										}
									}

									// check event 15
									if (devEvent.hasOwnProperty("event15") && !Libs.isBlank(devEvent.event15)) {
										var arrErrorCode15 = Libs.decimalToErrorCode(devEvent.event15);
										if (arrErrorCode15.length > 0) {
											var paramBit15 = {
												state_key: 'event15',
												id_device_group: getDeviceInfo.id_device_group,
												arrErrorCode: arrErrorCode15
											};

											// Lay danh sach loi tren he thong
											var _arrError14 = await db.queryForList("ModelReadings.getListError", paramBit15);
											if (_arrError14.length > 0) {
												for (var _i14 = 0; _i14 < _arrError14.length; _i14++) {
													checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", {
														id_device: getDeviceInfo.id,
														id_error: _arrError14[_i14].id
													});

													if (!checkExistAlerm) {
														// Insert alert
														db.insert("ModelReadings.insertAlert", {
															id_device: getDeviceInfo.id,
															id_error: _arrError14[_i14].id,
															start_date: data.timestamp,
															status: 1
														});

														//  Check sent mail
														if (!Libs.isBlank(_arrError14[_i14].id_error_level) && _arrError14[_i14].id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
															var _dataAlertSentMail20 = {
																error_code: _arrError14[_i14].error_code,
																description: _arrError14[_i14].description,
																message: _arrError14[_i14].message,
																solutions: _arrError14[_i14].solutions,
																error_type_name: _arrError14[_i14].error_type_name,
																error_level_name: _arrError14[_i14].error_level_name,
																device_name: getDeviceInfo.name,
																project_name: getDeviceInfo.project_name,
																full_name: getDeviceInfo.full_name,
																email: getDeviceInfo.email,
																error_date: getDeviceInfo.error_date
															};

															var _html20 = reportRender.render("alert/mail_alert", _dataAlertSentMail20);
															SentMail.SentMailHTML(null, _dataAlertSentMail20.email, 'Cảnh báo bất thường của PV - ' + _dataAlertSentMail20.project_name, _html20);
														}
													}
												}
											}
										}
									}

									break;

								// Sent error bit
								// case 'model_sensor_RT1':
								// 	break;

								// case 'model_sensor_IMT_SiRS485':
								// 	break;

								// case 'model_sensor_IMT_TaRS485':
								// 	break;

								// case '':
								// 	break;
								// case 'model_techedge':
								// 	break;

								// case 'model_inverter_Growatt_GW80KTL3':
								// 	break;
							}

							// // check event 4
							// if (devEvent.hasOwnProperty("event4") && !Libs.isBlank(devEvent.event4)) {
							// 	// get error id
							// 	let objParams = { state_key: 'event4', error_code: devEvent.event4 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}

							// 		}
							// 	}
							// }


							// // check event 5
							// if (devEvent.hasOwnProperty("event5") && !Libs.isBlank(devEvent.event5)) {
							// 	// get error id
							// 	let objParams = { state_key: 'event5', error_code: devEvent.event5 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }


							// // check event 6
							// if (devEvent.hasOwnProperty("event6") && !Libs.isBlank(devEvent.event6)) {
							// 	// get error id
							// 	let objParams = { state_key: 'event6', error_code: devEvent.event6 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }

							// // check event 7
							// if (devEvent.hasOwnProperty("event7") && !Libs.isBlank(devEvent.event7)) {
							// 	// get error id
							// 	let objParams = { state_key: 'event7', error_code: devEvent.event7 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }

							// // check event 8
							// if (devEvent.hasOwnProperty("event8") && !Libs.isBlank(devEvent.event8)) {
							// 	// get error id
							// 	let objParams = { state_key: 'event8', error_code: devEvent.event8 };
							// 	let objError = await db.queryForObject("ModelReadings.getErrorInfo", objParams);
							// 	if (objError) {
							// 		// check alert exists
							// 		checkExistAlerm = await db.queryForObject("ModelReadings.checkExistAlerm", { id_device: getDeviceInfo.id, id_error: objError.id });
							// 		if (!checkExistAlerm) {
							// 			// Insert alert
							// 			rs = await db.insert("ModelReadings.insertAlert", {
							// 				id_device: getDeviceInfo.id, id_error: objError.id, start_date: data.timestamp, status: 1
							// 			});

							// 			//  Check sent mail
							// 			if (!Libs.isBlank(objError.id_error_level) && objError.id_error_level == 1 && !Libs.isBlank(getDeviceInfo.email)) {
							// 				let dataAlertSentMail = {
							// 					error_code: objError.error_code,
							// 					description: objError.description,
							// 					message: objError.message,
							// 					solutions: objError.solutions,
							// 					error_type_name: objError.error_type_name,
							// 					error_level_name: objError.error_level_name,
							// 					device_name: getDeviceInfo.name,
							// 					project_name: getDeviceInfo.project_name,
							// 					full_name: getDeviceInfo.full_name,
							// 					email: getDeviceInfo.email,
							// 					error_date: getDeviceInfo.error_date
							// 				};
							// 				let html = reportRender.render("alert/mail_alert", dataAlertSentMail);
							// 				SentMail.SentMailHTML(null, dataAlertSentMail.email, ('Cảnh báo bất thường của PV - ' + dataAlertSentMail.project_name), html);
							// 			}
							// 		}
							// 	}
							// }
						}

						if (!rs) {
							conn.rollback();
							callBack(false, {});
							return;
						}

						conn.commit();
						callBack(true, rs);
					} catch (err) {
						console.log("Lỗi rolback", err);
						conn.rollback();
						callBack(false, err);
					}
				});
			} catch (e) {
				console.log('error', e);
				callBack(false, e);
			}
		}
	}]);

	return DataReadingsService;
}(_BaseService3.default);

exports.default = DataReadingsService;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EYXRhUmVhZGluZ3NTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkRhdGFSZWFkaW5nc1NlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImRhdGFQYXlsb2FkIiwicGF5bG9hZCIsIkxpYnMiLCJpc09iamVjdEVtcHR5IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJlbCIsImdldERldmljZUluZm8iLCJxdWVyeUZvck9iamVjdCIsImlzQmxhbmsiLCJ0YWJsZV9uYW1lIiwiaWQiLCJyb2xsYmFjayIsImRhdGFFbnRpdHkiLCJycyIsImNoZWNrRXhpc3RBbGVybSIsImFzc2lnbiIsIk1vZGVsRW1ldGVyR2VsZXhFbWljTUU0MUVudGl0eSIsInRpbWUiLCJ0aW1lc3RhbXAiLCJpZF9kZXZpY2UiLCJhY3RpdmVFbmVyZ3kiLCJhY3RpdmVFbmVyZ3lFeHBvcnQiLCJpZF9lcnJvciIsInN0YXR1cyIsImluc2VydCIsInN0YXJ0X2RhdGUiLCJsYXN0Um93Iiwidmlld190YWJsZSIsImRlbGV0ZSIsImxhc3RSb3dEYXRhVXBkYXRlZCIsImRldmljZVVwZGF0ZWQiLCJwb3dlcl9ub3ciLCJhY3RpdmVQb3dlciIsImVuZXJneV90b2RheSIsImxhc3RfbW9udGgiLCJlbmVyZ3lfbGFzdF9tb250aCIsImxpZmV0aW1lIiwibGFzdF91cGRhdGVkIiwidXBkYXRlIiwiTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNUVudGl0eSIsIk1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDUyMDIzRW50aXR5IiwiTW9kZWxJbnZlcnRlclNNQVNUUDExMEVudGl0eSIsIk1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHkiLCJNb2RlbFNlbnNvclJUMUVudGl0eSIsIk1vZGVsVGVjaGVkZ2VFbnRpdHkiLCJNb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHkiLCJNb2RlbFNlbnNvcklNVFNpUlM0ODVFbnRpdHkiLCJNb2RlbExvZ2dlclNNQUlNMjBFbnRpdHkiLCJNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkiLCJNb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHkiLCJjb21taXQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiZSIsImRldlN0YXR1cyIsImRldkV2ZW50IiwiaGFzT3duUHJvcGVydHkiLCJzdGF0dXMxIiwib2JqUGFyYW1zIiwic3RhdGVfa2V5IiwiZXJyb3JfY29kZSIsIm9iakVycm9yIiwiaWRfZXJyb3JfbGV2ZWwiLCJlbWFpbCIsImRhdGFBbGVydFNlbnRNYWlsIiwiZGVzY3JpcHRpb24iLCJtZXNzYWdlIiwic29sdXRpb25zIiwiZXJyb3JfdHlwZV9uYW1lIiwiZXJyb3JfbGV2ZWxfbmFtZSIsImRldmljZV9uYW1lIiwibmFtZSIsInByb2plY3RfbmFtZSIsImZ1bGxfbmFtZSIsImVycm9yX2RhdGUiLCJodG1sIiwicmVwb3J0UmVuZGVyIiwicmVuZGVyIiwiU2VudE1haWwiLCJTZW50TWFpbEhUTUwiLCJzdGF0dXMyIiwic3RhdHVzMyIsImV2ZW50MSIsImV2ZW50MiIsImV2ZW50MyIsImFyckVycm9yQ29kZTEiLCJkZWNpbWFsVG9FcnJvckNvZGUiLCJsZW5ndGgiLCJwYXJhbUJpdDEiLCJpZF9kZXZpY2VfZ3JvdXAiLCJhcnJFcnJvckNvZGUiLCJhcnJFcnJvciIsInF1ZXJ5Rm9yTGlzdCIsImkiLCJhcnJFcnJvckNvZGUyIiwicGFyYW1CaXQyIiwiYXJyRXJyb3JDb2RlMyIsInBhcmFtQml0MyIsImV2ZW50NCIsImFyckVycm9yQ29kZTQiLCJwYXJhbUJpdDQiLCJldmVudDUiLCJhcnJFcnJvckNvZGU1IiwicGFyYW1CaXQ1IiwiZXZlbnQ2IiwiYXJyRXJyb3JDb2RlNiIsInBhcmFtQml0NiIsImV2ZW50NyIsImFyckVycm9yQ29kZTciLCJwYXJhbUJpdDciLCJldmVudDgiLCJhcnJFcnJvckNvZGU4IiwicGFyYW1CaXQ4IiwiZXZlbnQ5IiwiYXJyRXJyb3JDb2RlOSIsInBhcmFtQml0OSIsImV2ZW50MTAiLCJhcnJFcnJvckNvZGUxMCIsInBhcmFtQml0MTAiLCJldmVudDExIiwiYXJyRXJyb3JDb2RlMTEiLCJwYXJhbUJpdDExIiwiZXZlbnQxMiIsImFyckVycm9yQ29kZTEyIiwicGFyYW1CaXQxMiIsImV2ZW50MTMiLCJhcnJFcnJvckNvZGUxMyIsInBhcmFtQml0MTMiLCJldmVudDE0IiwiYXJyRXJyb3JDb2RlMTQiLCJwYXJhbUJpdDE0IiwiZXZlbnQxNSIsImFyckVycm9yQ29kZTE1IiwicGFyYW1CaXQxNSIsIkJhc2VTZXJ2aWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsbUI7OztBQUNMLGdDQUFjO0FBQUE7O0FBQUE7QUFFYjs7QUFFRDs7Ozs7Ozs7OztxQ0FNbUJDLEksRUFBTUMsUSxFQUFVO0FBQ2xDLE9BQUk7QUFDSCxRQUFJQyxLQUFLLElBQUlDLE9BQUosRUFBVDtBQUNBRCxPQUFHRSxnQkFBSCxDQUFvQixnQkFBZ0JDLElBQWhCLEVBQXNCO0FBQ3pDLFNBQUk7QUFDSCxVQUFJQyxjQUFjTixLQUFLTyxPQUF2QjtBQUNBLFVBQUksQ0FBQ0MsS0FBS0MsYUFBTCxDQUFtQkgsV0FBbkIsQ0FBTCxFQUFzQztBQUNyQ0ksY0FBT0MsSUFBUCxDQUFZTCxXQUFaLEVBQXlCTSxPQUF6QixDQUFpQyxVQUFVQyxFQUFWLEVBQWM7QUFDOUNQLG9CQUFZTyxFQUFaLElBQW1CUCxZQUFZTyxFQUFaLEtBQW1CLE1BQW5CLElBQTZCUCxZQUFZTyxFQUFaLEtBQW1CLEVBQWpELEdBQXVELElBQXZELEdBQThEUCxZQUFZTyxFQUFaLENBQWhGO0FBQ0EsUUFGRDtBQUdBOztBQUVELFVBQUlDLGdCQUFnQixNQUFNWixH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O0FBQ0FsQixlQUFTLEtBQVQsRUFBZ0IwRCxHQUFoQjtBQUNBO0FBQ0QsS0FyNkNEO0FBczZDQSxJQXg2Q0QsQ0F3NkNFLE9BQU9HLENBQVAsRUFBVTtBQUNYRixZQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQkMsQ0FBckI7QUFDQTdELGFBQVMsS0FBVCxFQUFnQjZELENBQWhCO0FBQ0E7QUFDRDs7OztFQXpwRWdDaUYscUI7O2tCQTRwRW5CaEosbUIiLCJmaWxlIjoiRGF0YVJlYWRpbmdzU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2VydmljZSBmcm9tICcuL0Jhc2VTZXJ2aWNlJztcclxuaW1wb3J0IE1vZGVsU2Vuc29yUlQxRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsU2Vuc29yUlQxRW50aXR5JztcclxuaW1wb3J0IE1vZGVsU2Vuc29ySU1UVGFSUzQ4NUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxTZW5zb3JJTVRTaVJTNDg1RW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsU2Vuc29ySU1UU2lSUzQ4NUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbExvZ2dlclNNQUlNMjBFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxMb2dnZXJTTUFJTTIwRW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJTdW5ncm93U0cxMTBDWEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyU3VuZ3Jvd1NHMTEwQ1hFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlclNNQVNUUDUwRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJTTUFTVFA1MEVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJHcm93YXR0R1c4MEtUTDNFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlckdyb3dhdHRHVzgwS1RMM0VudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxFbWV0ZXJKYW5pdHphVU1HOTZTMkVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEVtZXRlckphbml0emFVTUc5NlMyRW50aXR5JztcclxuaW1wb3J0IE1vZGVsVGVjaGVkZ2VFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxUZWNoZWRnZUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyU01BU1RQMTEwRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJTTUFTVFAxMTBFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1RW50aXR5JztcclxuaW1wb3J0IE1vZGVsRW1ldGVyR2VsZXhFbWljTUU0MUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEVtZXRlckdlbGV4RW1pY01FNDFFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNTIwMjNFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNTIwMjNFbnRpdHknO1xyXG5cclxuY2xhc3MgRGF0YVJlYWRpbmdzU2VydmljZSBleHRlbmRzIEJhc2VTZXJ2aWNlIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGRhdGFcclxuXHQgKiBAYXV0aG9yIExvbmcuUGhhbVxyXG5cdCAqIEBzaW5jZSAxMC8wOS8yMDIxXHJcblx0ICogQHBhcmFtIHtPYmplY3QgbW9kZWx9IGRhdGFcclxuXHQgKi9cclxuXHRpbnNlcnREYXRhUmVhZGluZ3MoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIGRhdGFQYXlsb2FkID0gZGF0YS5wYXlsb2FkO1xyXG5cdFx0XHRcdFx0aWYgKCFMaWJzLmlzT2JqZWN0RW1wdHkoZGF0YVBheWxvYWQpKSB7XHJcblx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGRhdGFQYXlsb2FkKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFQYXlsb2FkW2VsXSA9IChkYXRhUGF5bG9hZFtlbF0gPT0gJ1xceDAwJyB8fCBkYXRhUGF5bG9hZFtlbF0gPT0gJycpID8gbnVsbCA6IGRhdGFQYXlsb2FkW2VsXTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGdldERldmljZUluZm8gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGV2aWNlSW5mb1wiLCBkYXRhKTtcclxuXHRcdFx0XHRcdGlmIChMaWJzLmlzT2JqZWN0RW1wdHkoZGF0YVBheWxvYWQpIHx8ICFnZXREZXZpY2VJbmZvIHx8IExpYnMuaXNPYmplY3RFbXB0eShnZXREZXZpY2VJbmZvKSB8fCBMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lKSB8fCBMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5pZCkpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bGV0IGRhdGFFbnRpdHkgPSB7fSwgcnMgPSB7fSwgY2hlY2tFeGlzdEFsZXJtID0gbnVsbDtcclxuXHRcdFx0XHRcdHN3aXRjaCAoZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfR2VsZXhFbWljX01FNDEnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxFbWV0ZXJHZWxleEVtaWNNRTQxRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneUV4cG9ydDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjQ5XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2NDksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5RXhwb3J0ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2NDksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsRW1ldGVyR2VsZXhFbWljTUU0MVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX1ZpbmFzaW5vX1ZTRTNUNSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1RW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDYyNlxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjI2LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjI2LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfVmluYXNpbm9fVlNFM1Q1MjAyMyc6XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDUyMDIzRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDY2M1xyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDY2MyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2NjMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNTIwMjNcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsSW52ZXJ0ZXJTTUFTVFAxMTBFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM3XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsSW52ZXJ0ZXJTTUFTVFAxMTBcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxJbnZlcnRlckFCQlBWUzEwMEVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjhcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQyOCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnZpZXdfdGFibGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQyOCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxJbnZlcnRlckFCQlBWUzEwMFwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby52aWV3X3RhYmxlXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9zZW5zb3JfUlQxJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsU2Vuc29yUlQxRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMlxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxTZW5zb3JSVDFcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7IGlkOiBnZXREZXZpY2VJbmZvLmlkLCBwb3dlcl9ub3c6IG51bGwsIGVuZXJneV90b2RheTogbnVsbCwgbGFzdF9tb250aDogbnVsbCwgbGlmZXRpbWU6IG51bGwsIGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lIH07XHJcblx0XHRcdFx0XHRcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF90ZWNoZWRnZSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbFRlY2hlZGdlRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM1LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbFRlY2hlZGdlXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9UYVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsU2Vuc29ySU1UVGFSUzQ4NUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzRcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxTZW5zb3JJTVRUYVJTNDg1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1NpUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxTZW5zb3JJTVRTaVJTNDg1RW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzM1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbFNlbnNvcklNVFNpUlM0ODVcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7IGlkOiBnZXREZXZpY2VJbmZvLmlkLCBwb3dlcl9ub3c6IG51bGwsIGVuZXJneV90b2RheTogbnVsbCwgbGFzdF9tb250aDogbnVsbCwgbGlmZXRpbWU6IG51bGwsIGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lIH07XHJcblx0XHRcdFx0XHRcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2xvZ2dlcl9TTUFfSU0yMCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbExvZ2dlclNNQUlNMjBFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMxXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsTG9nZ2VyU01BSU0yMFwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU3VuZ3Jvd19TRzExMENYJzpcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDUwJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsSW52ZXJ0ZXJTTUFTVFA1MEVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzBcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEludmVydGVyU01BU1RQNTBcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NIUDc1JzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsSW52ZXJ0ZXJTTUFTSFA3NUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjlcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQyOSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQyOSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEludmVydGVyU01BU0hQNzVcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udmlld190YWJsZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfR3Jvd2F0dF9HVzgwS1RMMyc6XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9KYW5pdHphX1VNRzk2UzInOlxyXG5cdFx0XHRcdFx0XHRcdC8vIGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxFbWV0ZXJKYW5pdHphVU1HOTZTMkVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0Ly8gZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHQvLyBjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGlkX2Vycm9yOiA0MjdcclxuXHRcdFx0XHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9lcnJvcjogNDI3LFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWRfZXJyb3I6IDQyNyxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxFbWV0ZXJKYW5pdHphVU1HOTZTMlwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoIXJzKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGNvbm4uY29tbWl0KCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayh0cnVlLCBycyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkzhu5dpIHJvbGJhY2tcIiwgZXJyKTtcclxuXHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlcnIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicsIGUpO1xyXG5cdFx0XHRjYWxsQmFjayhmYWxzZSwgZSk7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAZGVzY3JpcHRpb24gSW5zZXJ0IGFsYXJtXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTIvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IG1vZGVsfSBkYXRhXHJcblx0ICovXHJcblx0aW5zZXJ0QWxhcm1SZWFkaW5ncyhkYXRhLCBjYWxsQmFjaykge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dmFyIGRiID0gbmV3IG15U3FMREIoKTtcclxuXHRcdFx0ZGIuYmVnaW5UcmFuc2FjdGlvbihhc3luYyBmdW5jdGlvbiAoY29ubikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHR2YXIgZ2V0RGV2aWNlSW5mbyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREZXZpY2VJbmZvXCIsIGRhdGEpO1xyXG5cdFx0XHRcdFx0aWYgKCFnZXREZXZpY2VJbmZvIHx8IExpYnMuaXNPYmplY3RFbXB0eShnZXREZXZpY2VJbmZvKSB8fCBMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lKSB8fCBMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5pZCkpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bGV0IHJzID0ge30sIGNoZWNrRXhpc3RBbGVybSA9IG51bGw7XHJcblx0XHRcdFx0XHR2YXIgZGV2U3RhdHVzID0gZGF0YS5kZXZTdGF0dXM7XHJcblx0XHRcdFx0XHR2YXIgZGV2RXZlbnQgPSBkYXRhLmRldkV2ZW50O1xyXG5cclxuXHJcblx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgXHJcblx0XHRcdFx0XHRpZiAoIUxpYnMuaXNPYmplY3RFbXB0eShkZXZTdGF0dXMpKSB7XHJcblx0XHRcdFx0XHRcdHN3aXRjaCAoZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gc2VudCBlcnJvciBjb2RlIFxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFAxMTAnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfQUJCX1BWUzEwMCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDUwJzpcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIHN0YXR1cyAxXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzMVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXMxKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzMScsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXMxIH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgc3RhdHVzIDJcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXMyXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXMyJywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czIgfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgc3RhdHVzIDNcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXMzXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czMpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXMzJywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czMgfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX2ludmVydGVyX1N1bmdyb3dfU0cxMTBDWCc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gU2VudCBlcnJvciBiaXRcclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9zZW5zb3JfUlQxJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1NpUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3RlY2hlZGdlJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9pbnZlcnRlcl9Hcm93YXR0X0dXODBLVEwzJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gY2hlY2sgc3RhdHVzIDRcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czRcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzNCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXM0JywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czQgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBzdGF0dXMgNVxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzNVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXM1KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czUnLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzNSB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBzdGF0dXMgNlxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzNlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXM2KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czYnLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzNiB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgc3RhdHVzIDdcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czdcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzNykpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXM3JywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czcgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdC8vIENoZWNrIGV2ZW50IFxyXG5cdFx0XHRcdFx0aWYgKCFMaWJzLmlzT2JqZWN0RW1wdHkoZGV2RXZlbnQpKSB7XHJcblx0XHRcdFx0XHRcdHN3aXRjaCAoZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gc2VudCBlcnJvciBjb2RlIFxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDFcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDEpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDEnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDEgfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDJcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50MicsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50MiB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgM1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQzXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQzKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQzJywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQzIH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIFNlbnQgYml0IGNvZGVcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9BQkJfUFZTMTAwJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU0hQNzUnOlxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMSA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQyXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMiA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50Mik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQyID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQyJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQyKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgM1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQzXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQzKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMyA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50Myk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQzID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQzJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQzKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgNFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ0XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ0KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlNCA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50NCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGU0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQ0ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQ0JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQ0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgNVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ1XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ1KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlNSA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50NSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGU1Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQ1ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQ1JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQ1KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgNlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ2XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ2KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlNiA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50Nik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGU2Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQ2ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQ2JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTZcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQ2KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDdcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50N1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTcgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlNy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0NyA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50NycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGU3XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0Nyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCA4XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDhcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDgpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGU4ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQ4KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTgubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDggPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlOFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCA5XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDlcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDkpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGU5ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQ5KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTkubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDkgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDknLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlOVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxMFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxMFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MTApKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxMCA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MTApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMTAubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDEwID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxMCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDEwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDExXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDExXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxMSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTExID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxMSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxMS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MTEgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDExJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTExXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MTEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxMlxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxMlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MTIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxMiA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MTIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMTIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDEyID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxMicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxMlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDEyKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMTNcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MTNcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDEzKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMTMgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDEzKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTEzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxMyA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MTMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMTNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxMyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxNFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxNFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MTQpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxNCA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MTQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMTQubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDE0ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxNCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxNFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDE0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMTVcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MTVcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDE1KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMTUgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDE1KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTE1Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxNSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MTUnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMTVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxNSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gU2VudCBlcnJvciBiaXRcclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9zZW5zb3JfUlQxJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1NpUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJ21vZGVsX3RlY2hlZGdlJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9pbnZlcnRlcl9Hcm93YXR0X0dXODBLVEwzJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBldmVudCA0XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50NFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDQnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDQgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIGV2ZW50IDVcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ1XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ1KSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50NScsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50NSB9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBldmVudCA2XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50NlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDYnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDYgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBldmVudCA3XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50N1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NykpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDcnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDcgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBldmVudCA4XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50OFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50OCkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDgnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDggfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgcnMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRGF0YVJlYWRpbmdzU2VydmljZTtcclxuIl19