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
										table_name: getDeviceInfo.table_name
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

								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelEmeterGelexEmicME41", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
								// }

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
											id_error: 626,
											status: 0
										});
									}
								}

								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T5", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
								// }

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
											id_error: 663,
											status: 0
										});
									}
								}

								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelEmeterVinasinoVSE3T52023", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
								// }

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
											id_error: 437,
											status: 0
										});
									}
								}

								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASTP110", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
								// }

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
											id_error: 428,
											status: 0
										});
									}
								}

								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterABBPVS100", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
								// }

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
								// if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// }
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
								// if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// }
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
								// if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// }
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
								// if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// }
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
								// if (rs) {
								// Update device 
								// let deviceUpdated = { id: getDeviceInfo.id, power_now: null, energy_today: null, last_month: null, lifetime: null, last_updated: dataEntity.time };
								// db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// }
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
											id_error: 430,
											status: 0
										});
									}
								}

								// if (!Libs.isBlank(dataEntity.activeEnergy) && dataEntity.activeEnergy > 0) {
								rs = await db.insert("ModelReadings.insertModelInverterSMASTP50", dataEntity);
								// Update device 
								// if (rs) {
								// 	let lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
								// 		id_device: getDeviceInfo.id,
								// 		table_name: getDeviceInfo.table_name
								// 	});
								// 	if (lastRowDataUpdated) {
								// 		let deviceUpdated = {
								// 			id: getDeviceInfo.id,
								// 			power_now: lastRowDataUpdated.activePower ? lastRowDataUpdated.activePower : null,
								// 			energy_today: lastRowDataUpdated.energy_today,
								// 			last_month: lastRowDataUpdated.energy_last_month,
								// 			lifetime: lastRowDataUpdated.activeEnergy ? lastRowDataUpdated.activeEnergy : null,
								// 			last_updated: dataEntity.time
								// 		};
								// 		db.update("ModelReadings.updatedDevicePlant", deviceUpdated);
								// 	}
								// }
								// }

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
										var lastRowDataUpdated = await db.queryForObject("ModelReadings.getDataUpdateDevice", {
											id_device: getDeviceInfo.id,
											table_name: getDeviceInfo.table_name
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9EYXRhUmVhZGluZ3NTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIkRhdGFSZWFkaW5nc1NlcnZpY2UiLCJkYXRhIiwiY2FsbEJhY2siLCJkYiIsIm15U3FMREIiLCJiZWdpblRyYW5zYWN0aW9uIiwiY29ubiIsImRhdGFQYXlsb2FkIiwicGF5bG9hZCIsIkxpYnMiLCJpc09iamVjdEVtcHR5IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJlbCIsImdldERldmljZUluZm8iLCJxdWVyeUZvck9iamVjdCIsImlzQmxhbmsiLCJ0YWJsZV9uYW1lIiwiaWQiLCJyb2xsYmFjayIsImRhdGFFbnRpdHkiLCJycyIsImNoZWNrRXhpc3RBbGVybSIsImFzc2lnbiIsIk1vZGVsRW1ldGVyR2VsZXhFbWljTUU0MUVudGl0eSIsInRpbWUiLCJ0aW1lc3RhbXAiLCJpZF9kZXZpY2UiLCJhY3RpdmVFbmVyZ3kiLCJhY3RpdmVFbmVyZ3lFeHBvcnQiLCJpZF9lcnJvciIsInN0YXR1cyIsImluc2VydCIsInN0YXJ0X2RhdGUiLCJsYXN0Um93IiwiZGVsZXRlIiwiTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNUVudGl0eSIsIk1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDUyMDIzRW50aXR5IiwiTW9kZWxJbnZlcnRlclNNQVNUUDExMEVudGl0eSIsIk1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHkiLCJNb2RlbFNlbnNvclJUMUVudGl0eSIsIk1vZGVsVGVjaGVkZ2VFbnRpdHkiLCJNb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHkiLCJNb2RlbFNlbnNvcklNVFNpUlM0ODVFbnRpdHkiLCJNb2RlbExvZ2dlclNNQUlNMjBFbnRpdHkiLCJNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkiLCJNb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHkiLCJsYXN0Um93RGF0YVVwZGF0ZWQiLCJkZXZpY2VVcGRhdGVkIiwicG93ZXJfbm93IiwiYWN0aXZlUG93ZXIiLCJlbmVyZ3lfdG9kYXkiLCJsYXN0X21vbnRoIiwiZW5lcmd5X2xhc3RfbW9udGgiLCJsaWZldGltZSIsImxhc3RfdXBkYXRlZCIsInVwZGF0ZSIsImNvbW1pdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJlIiwiZGV2U3RhdHVzIiwiZGV2RXZlbnQiLCJoYXNPd25Qcm9wZXJ0eSIsInN0YXR1czEiLCJvYmpQYXJhbXMiLCJzdGF0ZV9rZXkiLCJlcnJvcl9jb2RlIiwib2JqRXJyb3IiLCJpZF9lcnJvcl9sZXZlbCIsImVtYWlsIiwiZGF0YUFsZXJ0U2VudE1haWwiLCJkZXNjcmlwdGlvbiIsIm1lc3NhZ2UiLCJzb2x1dGlvbnMiLCJlcnJvcl90eXBlX25hbWUiLCJlcnJvcl9sZXZlbF9uYW1lIiwiZGV2aWNlX25hbWUiLCJuYW1lIiwicHJvamVjdF9uYW1lIiwiZnVsbF9uYW1lIiwiZXJyb3JfZGF0ZSIsImh0bWwiLCJyZXBvcnRSZW5kZXIiLCJyZW5kZXIiLCJTZW50TWFpbCIsIlNlbnRNYWlsSFRNTCIsInN0YXR1czIiLCJzdGF0dXMzIiwiZXZlbnQxIiwiZXZlbnQyIiwiZXZlbnQzIiwiYXJyRXJyb3JDb2RlMSIsImRlY2ltYWxUb0Vycm9yQ29kZSIsImxlbmd0aCIsInBhcmFtQml0MSIsImlkX2RldmljZV9ncm91cCIsImFyckVycm9yQ29kZSIsImFyckVycm9yIiwicXVlcnlGb3JMaXN0IiwiaSIsImFyckVycm9yQ29kZTIiLCJwYXJhbUJpdDIiLCJhcnJFcnJvckNvZGUzIiwicGFyYW1CaXQzIiwiZXZlbnQ0IiwiYXJyRXJyb3JDb2RlNCIsInBhcmFtQml0NCIsImV2ZW50NSIsImFyckVycm9yQ29kZTUiLCJwYXJhbUJpdDUiLCJldmVudDYiLCJhcnJFcnJvckNvZGU2IiwicGFyYW1CaXQ2IiwiZXZlbnQ3IiwiYXJyRXJyb3JDb2RlNyIsInBhcmFtQml0NyIsImV2ZW50OCIsImFyckVycm9yQ29kZTgiLCJwYXJhbUJpdDgiLCJldmVudDkiLCJhcnJFcnJvckNvZGU5IiwicGFyYW1CaXQ5IiwiZXZlbnQxMCIsImFyckVycm9yQ29kZTEwIiwicGFyYW1CaXQxMCIsImV2ZW50MTEiLCJhcnJFcnJvckNvZGUxMSIsInBhcmFtQml0MTEiLCJldmVudDEyIiwiYXJyRXJyb3JDb2RlMTIiLCJwYXJhbUJpdDEyIiwiZXZlbnQxMyIsImFyckVycm9yQ29kZTEzIiwicGFyYW1CaXQxMyIsImV2ZW50MTQiLCJhcnJFcnJvckNvZGUxNCIsInBhcmFtQml0MTQiLCJldmVudDE1IiwiYXJyRXJyb3JDb2RlMTUiLCJwYXJhbUJpdDE1IiwiQmFzZVNlcnZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxtQjs7O0FBQ0wsZ0NBQWM7QUFBQTs7QUFBQTtBQUViOztBQUVEOzs7Ozs7Ozs7O3FDQU1tQkMsSSxFQUFNQyxRLEVBQVU7QUFDbEMsT0FBSTtBQUNILFFBQUlDLEtBQUssSUFBSUMsT0FBSixFQUFUO0FBQ0FELE9BQUdFLGdCQUFILENBQW9CLGdCQUFnQkMsSUFBaEIsRUFBc0I7QUFDekMsU0FBSTtBQUNILFVBQUlDLGNBQWNOLEtBQUtPLE9BQXZCO0FBQ0EsVUFBSSxDQUFDQyxLQUFLQyxhQUFMLENBQW1CSCxXQUFuQixDQUFMLEVBQXNDO0FBQ3JDSSxjQUFPQyxJQUFQLENBQVlMLFdBQVosRUFBeUJNLE9BQXpCLENBQWlDLFVBQVVDLEVBQVYsRUFBYztBQUM5Q1Asb0JBQVlPLEVBQVosSUFBbUJQLFlBQVlPLEVBQVosS0FBbUIsTUFBbkIsSUFBNkJQLFlBQVlPLEVBQVosS0FBbUIsRUFBakQsR0FBdUQsSUFBdkQsR0FBOERQLFlBQVlPLEVBQVosQ0FBaEY7QUFDQSxRQUZEO0FBR0E7O0FBRUQsVUFBSUMsZ0JBQWdCLE1BQU1aLEdBQUdhLGNBQUgsQ0FB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WyJpbXBvcnQgQmFzZVNlcnZpY2UgZnJvbSAnLi9CYXNlU2VydmljZSc7XHJcbmltcG9ydCBNb2RlbFNlbnNvclJUMUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbFNlbnNvclJUMUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxTZW5zb3JJTVRUYVJTNDg1RW50aXR5JztcclxuaW1wb3J0IE1vZGVsU2Vuc29ySU1UU2lSUzQ4NUVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbFNlbnNvcklNVFNpUlM0ODVFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxMb2dnZXJTTUFJTTIwRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsTG9nZ2VyU01BSU0yMEVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyU3VuZ3Jvd1NHMTEwQ1hFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxJbnZlcnRlclN1bmdyb3dTRzExMENYRW50aXR5JztcclxuaW1wb3J0IE1vZGVsSW52ZXJ0ZXJTTUFTVFA1MEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlclNNQVNIUDc1RW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJTTUFTSFA3NUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEludmVydGVyR3Jvd2F0dEdXODBLVEwzRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsSW52ZXJ0ZXJHcm93YXR0R1c4MEtUTDNFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlckFCQlBWUzEwMEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyQUJCUFZTMTAwRW50aXR5JztcclxuaW1wb3J0IE1vZGVsRW1ldGVySmFuaXR6YVVNRzk2UzJFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxFbWV0ZXJKYW5pdHphVU1HOTZTMkVudGl0eSc7XHJcbmltcG9ydCBNb2RlbFRlY2hlZGdlRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsVGVjaGVkZ2VFbnRpdHknO1xyXG5pbXBvcnQgTW9kZWxJbnZlcnRlclNNQVNUUDExMEVudGl0eSBmcm9tICcuLi9lbnRpdGllcy9Nb2RlbEludmVydGVyU01BU1RQMTEwRW50aXR5JztcclxuaW1wb3J0IE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDVFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNUVudGl0eSc7XHJcbmltcG9ydCBNb2RlbEVtZXRlckdlbGV4RW1pY01FNDFFbnRpdHkgZnJvbSAnLi4vZW50aXRpZXMvTW9kZWxFbWV0ZXJHZWxleEVtaWNNRTQxRW50aXR5JztcclxuaW1wb3J0IE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDUyMDIzRW50aXR5IGZyb20gJy4uL2VudGl0aWVzL01vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDUyMDIzRW50aXR5JztcclxuXHJcbmNsYXNzIERhdGFSZWFkaW5nc1NlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEluc2VydCBkYXRhXHJcblx0ICogQGF1dGhvciBMb25nLlBoYW1cclxuXHQgKiBAc2luY2UgMTAvMDkvMjAyMVxyXG5cdCAqIEBwYXJhbSB7T2JqZWN0IG1vZGVsfSBkYXRhXHJcblx0ICovXHJcblx0aW5zZXJ0RGF0YVJlYWRpbmdzKGRhdGEsIGNhbGxCYWNrKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR2YXIgZGIgPSBuZXcgbXlTcUxEQigpO1xyXG5cdFx0XHRkYi5iZWdpblRyYW5zYWN0aW9uKGFzeW5jIGZ1bmN0aW9uIChjb25uKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHZhciBkYXRhUGF5bG9hZCA9IGRhdGEucGF5bG9hZDtcclxuXHRcdFx0XHRcdGlmICghTGlicy5pc09iamVjdEVtcHR5KGRhdGFQYXlsb2FkKSkge1xyXG5cdFx0XHRcdFx0XHRPYmplY3Qua2V5cyhkYXRhUGF5bG9hZCkuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRcdFx0XHRkYXRhUGF5bG9hZFtlbF0gPSAoZGF0YVBheWxvYWRbZWxdID09ICdcXHgwMCcgfHwgZGF0YVBheWxvYWRbZWxdID09ICcnKSA/IG51bGwgOiBkYXRhUGF5bG9hZFtlbF07XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBnZXREZXZpY2VJbmZvID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERldmljZUluZm9cIiwgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoTGlicy5pc09iamVjdEVtcHR5KGRhdGFQYXlsb2FkKSB8fCAhZ2V0RGV2aWNlSW5mbyB8fCBMaWJzLmlzT2JqZWN0RW1wdHkoZ2V0RGV2aWNlSW5mbykgfHwgTGlicy5pc0JsYW5rKGdldERldmljZUluZm8udGFibGVfbmFtZSkgfHwgTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uaWQpKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxldCBkYXRhRW50aXR5ID0ge30sIHJzID0ge30sIGNoZWNrRXhpc3RBbGVybSA9IG51bGw7XHJcblx0XHRcdFx0XHRzd2l0Y2ggKGdldERldmljZUluZm8udGFibGVfbmFtZSkge1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX0dlbGV4RW1pY19NRTQxJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsRW1ldGVyR2VsZXhFbWljTUU0MUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3lFeHBvcnQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDY0OVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjQ5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneUV4cG9ydCA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjQ5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEVtZXRlckdlbGV4RW1pY01FNDFcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gaWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2VtZXRlcl9WaW5hc2lub19WU0UzVDUnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2MjZcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDYyNixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDYyNixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxFbWV0ZXJWaW5hc2lub1ZTRTNUNVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0bGV0IGxhc3RSb3dEYXRhVXBkYXRlZCA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXREYXRhVXBkYXRlRGV2aWNlXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRpZiAobGFzdFJvd0RhdGFVcGRhdGVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZDogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdHBvd2VyX25vdzogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZVBvd2VyIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfbW9udGg6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfbGFzdF9tb250aCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxpZmV0aW1lOiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5ID8gbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0ZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfZW1ldGVyX1ZpbmFzaW5vX1ZTRTNUNTIwMjMnOlxyXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEVtZXRlclZpbmFzaW5vVlNFM1Q1MjAyM0VudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2NjNcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA2NjMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNjYzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsRW1ldGVyVmluYXNpbm9WU0UzVDUyMDIzXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0bGV0IGRldmljZVVwZGF0ZWQgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGVuZXJneV90b2RheTogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV90b2RheSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDExMCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyU01BU1RQMTEwRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzN1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM3LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBHZXQgbGFzdCByb3cgYnkgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGxhc3RSb3cgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGFzdFJvd0RhdGFcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobGFzdFJvdykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA9IGxhc3RSb3cuYWN0aXZlRW5lcmd5O1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM3LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGlmICghTGlicy5pc0JsYW5rKGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5KSAmJiBkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbEludmVydGVyU01BU1RQMTEwXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9BQkJfUFZTMTAwJzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI4XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKCFMaWJzLmlzQmxhbmsoZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kpICYmIGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsSW52ZXJ0ZXJBQkJQVlMxMDBcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gaWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGxldCBsYXN0Um93RGF0YVVwZGF0ZWQgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGF0YVVwZGF0ZURldmljZVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdHRhYmxlX25hbWU6IGdldERldmljZUluZm8udGFibGVfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0aWYgKGxhc3RSb3dEYXRhVXBkYXRlZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGxldCBkZXZpY2VVcGRhdGVkID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWQ6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRwb3dlcl9ub3c6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVQb3dlciA6IG51bGwsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRlbmVyZ3lfdG9kYXk6IGxhc3RSb3dEYXRhVXBkYXRlZC5lbmVyZ3lfdG9kYXksXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsYXN0X21vbnRoOiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X2xhc3RfbW9udGgsXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRsaWZldGltZTogbGFzdFJvd0RhdGFVcGRhdGVkLmFjdGl2ZUVuZXJneSA/IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX1JUMSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbFNlbnNvclJUMUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzJcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsU2Vuc29yUlQxXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfdGVjaGVkZ2UnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxUZWNoZWRnZUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzVcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM1LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxUZWNoZWRnZVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX3NlbnNvcl9JTVRfVGFSUzQ4NSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbFNlbnNvcklNVFRhUlM0ODVFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDM0XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzNCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsU2Vuc29ySU1UVGFSUzQ4NVwiLCBkYXRhRW50aXR5KTtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAocnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFVwZGF0ZSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBsZXQgZGV2aWNlVXBkYXRlZCA9IHsgaWQ6IGdldERldmljZUluZm8uaWQsIHBvd2VyX25vdzogbnVsbCwgZW5lcmd5X3RvZGF5OiBudWxsLCBsYXN0X21vbnRoOiBudWxsLCBsaWZldGltZTogbnVsbCwgbGFzdF91cGRhdGVkOiBkYXRhRW50aXR5LnRpbWUgfTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGRiLnVwZGF0ZShcIk1vZGVsUmVhZGluZ3MudXBkYXRlZERldmljZVBsYW50XCIsIGRldmljZVVwZGF0ZWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9TaVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsU2Vuc29ySU1UU2lSUzQ4NUVudGl0eSgpLCBkYXRhUGF5bG9hZCk7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS50aW1lID0gZGF0YS50aW1lc3RhbXA7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5pZF9kZXZpY2UgPSBnZXREZXZpY2VJbmZvLmlkO1xyXG5cdFx0XHRcdFx0XHRcdC8vIENoZWNrIHN0YXR1cyBESVNDT05ORUNURURcclxuXHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzNcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhLnN0YXR1cykgJiYgZGF0YS5zdGF0dXMgPT0gJ0RJU0NPTk5FQ1RFRCcpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydCBlcnJvciBzeXN0ZW0gZGlzY29ubmVjdGVkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxTZW5zb3JJTVRTaVJTNDg1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGxldCBkZXZpY2VVcGRhdGVkID0geyBpZDogZ2V0RGV2aWNlSW5mby5pZCwgcG93ZXJfbm93OiBudWxsLCBlbmVyZ3lfdG9kYXk6IG51bGwsIGxhc3RfbW9udGg6IG51bGwsIGxpZmV0aW1lOiBudWxsLCBsYXN0X3VwZGF0ZWQ6IGRhdGFFbnRpdHkudGltZSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gZGIudXBkYXRlKFwiTW9kZWxSZWFkaW5ncy51cGRhdGVkRGV2aWNlUGxhbnRcIiwgZGV2aWNlVXBkYXRlZCk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9sb2dnZXJfU01BX0lNMjAnOlxyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkgPSBPYmplY3QuYXNzaWduKHt9LCBuZXcgTW9kZWxMb2dnZXJTTUFJTTIwRW50aXR5KCksIGRhdGFQYXlsb2FkKTtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LnRpbWUgPSBkYXRhLnRpbWVzdGFtcDtcclxuXHRcdFx0XHRcdFx0XHRkYXRhRW50aXR5LmlkX2RldmljZSA9IGdldERldmljZUluZm8uaWQ7XHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIERJU0NPTk5FQ1RFRFxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MzEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjbG9zZSBhbGFybSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgZGIuZGVsZXRlKFwiTW9kZWxSZWFkaW5ncy5jbG9zZUFsYXJtRGlzY29ubmVjdGVkXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZDogY2hlY2tFeGlzdEFsZXJtLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRNb2RlbExvZ2dlclNNQUlNMjBcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBVcGRhdGUgZGV2aWNlIFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gbGV0IGRldmljZVVwZGF0ZWQgPSB7IGlkOiBnZXREZXZpY2VJbmZvLmlkLCBwb3dlcl9ub3c6IG51bGwsIGVuZXJneV90b2RheTogbnVsbCwgbGFzdF9tb250aDogbnVsbCwgbGlmZXRpbWU6IG51bGwsIGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lIH07XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1N1bmdyb3dfU0cxMTBDWCc6XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyU01BU1RQNTBFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDMwXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gR2V0IGxhc3Qgcm93IGJ5IGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBsYXN0Um93ID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldExhc3RSb3dEYXRhXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGxhc3RSb3cpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPSBsYXN0Um93LmFjdGl2ZUVuZXJneTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2xvc2UgYWxhcm0gXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IGRiLmRlbGV0ZShcIk1vZGVsUmVhZGluZ3MuY2xvc2VBbGFybURpc2Nvbm5lY3RlZFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWQ6IGNoZWNrRXhpc3RBbGVybS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IDQzMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxJbnZlcnRlclNNQVNUUDUwXCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TSFA3NSc6XHJcblx0XHRcdFx0XHRcdFx0ZGF0YUVudGl0eSA9IE9iamVjdC5hc3NpZ24oe30sIG5ldyBNb2RlbEludmVydGVyU01BU0hQNzVFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogNDI5XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGRhdGEuc3RhdHVzKSAmJiBkYXRhLnN0YXR1cyA9PSAnRElTQ09OTkVDVEVEJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0IGVycm9yIHN5c3RlbSBkaXNjb25uZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIEdldCBsYXN0IHJvdyBieSBkZXZpY2UgXHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbGFzdFJvdyA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMYXN0Um93RGF0YVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFibGVfbmFtZTogZ2V0RGV2aWNlSW5mby50YWJsZV9uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGFFbnRpdHkuYWN0aXZlRW5lcmd5ID0gbGFzdFJvdy5hY3RpdmVFbmVyZ3k7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiA0MjksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhkYXRhRW50aXR5LmFjdGl2ZUVuZXJneSkgJiYgZGF0YUVudGl0eS5hY3RpdmVFbmVyZ3kgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0TW9kZWxJbnZlcnRlclNNQVNIUDc1XCIsIGRhdGFFbnRpdHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXBkYXRlIGRldmljZSBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChycykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgbGFzdFJvd0RhdGFVcGRhdGVkID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldERhdGFVcGRhdGVEZXZpY2VcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YWJsZV9uYW1lOiBnZXREZXZpY2VJbmZvLnRhYmxlX25hbWVcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChsYXN0Um93RGF0YVVwZGF0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGV2aWNlVXBkYXRlZCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG93ZXJfbm93OiBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlUG93ZXIgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW5lcmd5X3RvZGF5OiBsYXN0Um93RGF0YVVwZGF0ZWQuZW5lcmd5X3RvZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdF9tb250aDogbGFzdFJvd0RhdGFVcGRhdGVkLmVuZXJneV9sYXN0X21vbnRoLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGlmZXRpbWU6IGxhc3RSb3dEYXRhVXBkYXRlZC5hY3RpdmVFbmVyZ3kgPyBsYXN0Um93RGF0YVVwZGF0ZWQuYWN0aXZlRW5lcmd5IDogbnVsbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RfdXBkYXRlZDogZGF0YUVudGl0eS50aW1lXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYi51cGRhdGUoXCJNb2RlbFJlYWRpbmdzLnVwZGF0ZWREZXZpY2VQbGFudFwiLCBkZXZpY2VVcGRhdGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0dyb3dhdHRfR1c4MEtUTDMnOlxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9lbWV0ZXJfSmFuaXR6YV9VTUc5NlMyJzpcclxuXHRcdFx0XHRcdFx0XHQvLyBkYXRhRW50aXR5ID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3IE1vZGVsRW1ldGVySmFuaXR6YVVNRzk2UzJFbnRpdHkoKSwgZGF0YVBheWxvYWQpO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGRhdGFFbnRpdHkudGltZSA9IGRhdGEudGltZXN0YW1wO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGRhdGFFbnRpdHkuaWRfZGV2aWNlID0gZ2V0RGV2aWNlSW5mby5pZDtcclxuXHRcdFx0XHRcdFx0XHQvLyAvLyBDaGVjayBzdGF0dXMgRElTQ09OTkVDVEVEXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRpZF9lcnJvcjogNDI3XHJcblx0XHRcdFx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaWYgKCFMaWJzLmlzQmxhbmsoZGF0YS5zdGF0dXMpICYmIGRhdGEuc3RhdHVzID09ICdESVNDT05ORUNURUQnKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHQvLyBJbnNlcnQgYWxlcnQgZXJyb3Igc3lzdGVtIGRpc2Nvbm5lY3RlZFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWRfZXJyb3I6IDQyNyxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHQvLyBcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBcdC8vIGNsb3NlIGFsYXJtIFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0aWYgKGNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRhd2FpdCBkYi5kZWxldGUoXCJNb2RlbFJlYWRpbmdzLmNsb3NlQWxhcm1EaXNjb25uZWN0ZWRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkOiBjaGVja0V4aXN0QWxlcm0uaWQsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0XHRcdGlkX2Vycm9yOiA0MjcsXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdFx0c3RhdHVzOiAwXHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gcnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydE1vZGVsRW1ldGVySmFuaXR6YVVNRzk2UzJcIiwgZGF0YUVudGl0eSk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFycykge1xyXG5cdFx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRcdGNhbGxCYWNrKGZhbHNlLCB7fSk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb25uLmNvbW1pdCgpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2sodHJ1ZSwgcnMpO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJM4buXaSByb2xiYWNrXCIsIGVycik7XHJcblx0XHRcdFx0XHRjb25uLnJvbGxiYWNrKCk7XHJcblx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwgZXJyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcclxuXHRcdFx0Y2FsbEJhY2soZmFsc2UsIGUpO1xyXG5cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQGRlc2NyaXB0aW9uIEluc2VydCBhbGFybVxyXG5cdCAqIEBhdXRob3IgTG9uZy5QaGFtXHJcblx0ICogQHNpbmNlIDEyLzA5LzIwMjFcclxuXHQgKiBAcGFyYW0ge09iamVjdCBtb2RlbH0gZGF0YVxyXG5cdCAqL1xyXG5cdGluc2VydEFsYXJtUmVhZGluZ3MoZGF0YSwgY2FsbEJhY2spIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHZhciBkYiA9IG5ldyBteVNxTERCKCk7XHJcblx0XHRcdGRiLmJlZ2luVHJhbnNhY3Rpb24oYXN5bmMgZnVuY3Rpb24gKGNvbm4pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIGdldERldmljZUluZm8gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RGV2aWNlSW5mb1wiLCBkYXRhKTtcclxuXHRcdFx0XHRcdGlmICghZ2V0RGV2aWNlSW5mbyB8fCBMaWJzLmlzT2JqZWN0RW1wdHkoZ2V0RGV2aWNlSW5mbykgfHwgTGlicy5pc0JsYW5rKGdldERldmljZUluZm8udGFibGVfbmFtZSkgfHwgTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uaWQpKSB7XHJcblx0XHRcdFx0XHRcdGNvbm4ucm9sbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIHt9KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGxldCBycyA9IHt9LCBjaGVja0V4aXN0QWxlcm0gPSBudWxsO1xyXG5cdFx0XHRcdFx0dmFyIGRldlN0YXR1cyA9IGRhdGEuZGV2U3RhdHVzO1xyXG5cdFx0XHRcdFx0dmFyIGRldkV2ZW50ID0gZGF0YS5kZXZFdmVudDtcclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgc3RhdHVzIFxyXG5cdFx0XHRcdFx0aWYgKCFMaWJzLmlzT2JqZWN0RW1wdHkoZGV2U3RhdHVzKSkge1xyXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKGdldERldmljZUluZm8udGFibGVfbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHNlbnQgZXJyb3IgY29kZSBcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQMTEwJzpcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU0hQNzUnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX0FCQl9QVlMxMDAnOlxyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ21vZGVsX2ludmVydGVyX1NNQV9TVFA1MCc6XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBzdGF0dXMgMVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czFcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzMSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ3N0YXR1czEnLCBlcnJvcl9jb2RlOiBkZXZTdGF0dXMuc3RhdHVzMSB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIHN0YXR1cyAyXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzMlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXMyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzMicsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXMyIH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIHN0YXR1cyAzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2U3RhdHVzLmhhc093blByb3BlcnR5KFwic3RhdHVzM1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldlN0YXR1cy5zdGF0dXMzKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzMycsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXMzIH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9pbnZlcnRlcl9TdW5ncm93X1NHMTEwQ1gnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIFNlbnQgZXJyb3IgYml0XHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfc2Vuc29yX1JUMSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9TaVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1RhUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJyc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF90ZWNoZWRnZSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfaW52ZXJ0ZXJfR3Jvd2F0dF9HVzgwS1RMMyc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIGNoZWNrIHN0YXR1cyA0XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXM0XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czQpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzNCcsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXM0IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgc3RhdHVzIDVcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czVcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzNSkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXM1JywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czUgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgc3RhdHVzIDZcclxuXHRcdFx0XHRcdFx0Ly8gaWYgKGRldlN0YXR1cy5oYXNPd25Qcm9wZXJ0eShcInN0YXR1czZcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZTdGF0dXMuc3RhdHVzNikpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdzdGF0dXM2JywgZXJyb3JfY29kZTogZGV2U3RhdHVzLnN0YXR1czYgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIC8vIGNoZWNrIHN0YXR1cyA3XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZTdGF0dXMuaGFzT3duUHJvcGVydHkoXCJzdGF0dXM3XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2U3RhdHVzLnN0YXR1czcpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnc3RhdHVzNycsIGVycm9yX2NvZGU6IGRldlN0YXR1cy5zdGF0dXM3IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHQvLyBDaGVjayBldmVudCBcclxuXHRcdFx0XHRcdGlmICghTGlicy5pc09iamVjdEVtcHR5KGRldkV2ZW50KSkge1xyXG5cdFx0XHRcdFx0XHRzd2l0Y2ggKGdldERldmljZUluZm8udGFibGVfbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHNlbnQgZXJyb3IgY29kZSBcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtb2RlbF9pbnZlcnRlcl9TTUFfU1RQNTAnOlxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQxJywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQxIH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5nZXRFcnJvckluZm9cIiwgb2JqUGFyYW1zKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7IGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkIH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJzID0gYXdhaXQgZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBvYmpFcnJvci5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogb2JqRXJyb3Iuc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAyXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDJcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGdldCBlcnJvciBpZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDInLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDIgfTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAob2JqRXJyb3IpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQsIHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLCBzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKG9iakVycm9yLmlkX2Vycm9yX2xldmVsKSAmJiBvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IG9iakVycm9yLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBvYmpFcnJvci5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDNcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50M1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBvYmpQYXJhbXMgPSB7IHN0YXRlX2tleTogJ2V2ZW50MycsIGVycm9yX2NvZGU6IGRldkV2ZW50LmV2ZW50MyB9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGFsZXJ0IGV4aXN0c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogb2JqRXJyb3IubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBvYmpFcnJvci5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBTZW50IGJpdCBjb2RlXHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NUUDExMCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfQUJCX1BWUzEwMCc6XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbW9kZWxfaW52ZXJ0ZXJfU01BX1NIUDc1JzpcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDFcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTEgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MScsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDJcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTIgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDIpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MiA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUyXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0Mik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDNcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50M1wiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTMgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MyA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MycsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0Myk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50NFwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTQgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlNC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0NCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50NCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGU0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0NCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDVcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50NVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTUgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlNS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0NSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50NScsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGU1XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0NSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDZcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50NlwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NikpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTYgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDYpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlNi5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0NiA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50NicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGU2XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0Nik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCA3XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDdcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDcpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGU3ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQ3KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTcubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDcgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlN1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDcpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgOFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ4XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ4KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlOCA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50OCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGU4Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQ4ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQ4JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZThcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQ4KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgOVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQ5XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQ5KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlOSA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50OSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGU5Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQ5ID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQ5JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQ5KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMTBcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MTBcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDEwKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMTAgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDEwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTEwLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxMCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MTAnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMTBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjaGVjayBldmVudCAxMVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGRldkV2ZW50Lmhhc093blByb3BlcnR5KFwiZXZlbnQxMVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50MTEpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvckNvZGUxMSA9IExpYnMuZGVjaW1hbFRvRXJyb3JDb2RlKGRldkV2ZW50LmV2ZW50MTEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3JDb2RlMTEubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBwYXJhbUJpdDExID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdGVfa2V5OiAnZXZlbnQxMScsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2VfZ3JvdXA6IGdldERldmljZUluZm8uaWRfZGV2aWNlX2dyb3VwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXJyRXJyb3JDb2RlOiBhcnJFcnJvckNvZGUxMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIExheSBkYW5oIHNhY2ggbG9pIHRyZW4gaGUgdGhvbmdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvckxpc3QoXCJNb2RlbFJlYWRpbmdzLmdldExpc3RFcnJvclwiLCBwYXJhbUJpdDExKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoYXJyRXJyb3IubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJFcnJvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFjaGVja0V4aXN0QWxlcm0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXJ0X2RhdGU6IGRhdGEudGltZXN0YW1wLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCkgJiYgYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YUFsZXJ0U2VudE1haWwgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2NvZGU6IGFyckVycm9yW2ldLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBhcnJFcnJvcltpXS5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogYXJyRXJyb3JbaV0ubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c29sdXRpb25zOiBhcnJFcnJvcltpXS5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9sZXZlbF9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl9sZXZlbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmdWxsX25hbWU6IGdldERldmljZUluZm8uZnVsbF9uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBodG1sID0gcmVwb3J0UmVuZGVyLnJlbmRlcihcImFsZXJ0L21haWxfYWxlcnRcIiwgZGF0YUFsZXJ0U2VudE1haWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMTJcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MTJcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDEyKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMTIgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDEyKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTEyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxMiA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MTInLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMTJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxMik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDEzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDEzXCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxMykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTEzID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxMyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxMy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MTMgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDEzJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTEzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MTMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2sgZXZlbnQgMTRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50MTRcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDE0KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYXJyRXJyb3JDb2RlMTQgPSBMaWJzLmRlY2ltYWxUb0Vycm9yQ29kZShkZXZFdmVudC5ldmVudDE0KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yQ29kZTE0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgcGFyYW1CaXQxNCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXRlX2tleTogJ2V2ZW50MTQnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlX2dyb3VwOiBnZXREZXZpY2VJbmZvLmlkX2RldmljZV9ncm91cCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFyckVycm9yQ29kZTogYXJyRXJyb3JDb2RlMTRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBMYXkgZGFuaCBzYWNoIGxvaSB0cmVuIGhlIHRob25nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JMaXN0KFwiTW9kZWxSZWFkaW5ncy5nZXRMaXN0RXJyb3JcIiwgcGFyYW1CaXQxNCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGFyckVycm9yLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyRXJyb3IubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2hlY2tFeGlzdEFsZXJtID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmNoZWNrRXhpc3RBbGVybVwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2Vycm9yOiBhcnJFcnJvcltpXS5pZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSW5zZXJ0IGFsZXJ0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIuaW5zZXJ0KFwiTW9kZWxSZWFkaW5ncy5pbnNlcnRBbGVydFwiLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyAgQ2hlY2sgc2VudCBtYWlsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsoYXJyRXJyb3JbaV0uaWRfZXJyb3JfbGV2ZWwpICYmIGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9jb2RlOiBhcnJFcnJvcltpXS5lcnJvcl9jb2RlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYXJyRXJyb3JbaV0uZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6IGFyckVycm9yW2ldLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHNvbHV0aW9uczogYXJyRXJyb3JbaV0uc29sdXRpb25zLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IGFyckVycm9yW2ldLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogYXJyRXJyb3JbaV0uZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGV2aWNlX25hbWU6IGdldERldmljZUluZm8ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZW1haWw6IGdldERldmljZUluZm8uZW1haWwsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFNlbnRNYWlsLlNlbnRNYWlsSFRNTChudWxsLCBkYXRhQWxlcnRTZW50TWFpbC5lbWFpbCwgKCdD4bqjbmggYsOhbyBi4bqldCB0aMaw4budbmcgY+G7p2EgUFYgLSAnICsgZGF0YUFsZXJ0U2VudE1haWwucHJvamVjdF9uYW1lKSwgaHRtbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGV2ZW50IDE1XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDE1XCIpICYmICFMaWJzLmlzQmxhbmsoZGV2RXZlbnQuZXZlbnQxNSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IGFyckVycm9yQ29kZTE1ID0gTGlicy5kZWNpbWFsVG9FcnJvckNvZGUoZGV2RXZlbnQuZXZlbnQxNSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvckNvZGUxNS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IHBhcmFtQml0MTUgPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0ZV9rZXk6ICdldmVudDE1JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZV9ncm91cDogZ2V0RGV2aWNlSW5mby5pZF9kZXZpY2VfZ3JvdXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhcnJFcnJvckNvZGU6IGFyckVycm9yQ29kZTE1XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gTGF5IGRhbmggc2FjaCBsb2kgdHJlbiBoZSB0aG9uZ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBhcnJFcnJvciA9IGF3YWl0IGRiLnF1ZXJ5Rm9yTGlzdChcIk1vZGVsUmVhZGluZ3MuZ2V0TGlzdEVycm9yXCIsIHBhcmFtQml0MTUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChhcnJFcnJvci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFyckVycm9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZF9lcnJvcjogYXJyRXJyb3JbaV0uaWRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWRfZXJyb3I6IGFyckVycm9yW2ldLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdGF0dXM6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghTGlicy5pc0JsYW5rKGFyckVycm9yW2ldLmlkX2Vycm9yX2xldmVsKSAmJiBhcnJFcnJvcltpXS5pZF9lcnJvcl9sZXZlbCA9PSAxICYmICFMaWJzLmlzQmxhbmsoZ2V0RGV2aWNlSW5mby5lbWFpbCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfY29kZTogYXJyRXJyb3JbaV0uZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVzY3JpcHRpb246IGFyckVycm9yW2ldLmRlc2NyaXB0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBhcnJFcnJvcltpXS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzb2x1dGlvbnM6IGFyckVycm9yW2ldLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3JfdHlwZV9uYW1lOiBhcnJFcnJvcltpXS5lcnJvcl90eXBlX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IGFyckVycm9yW2ldLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHByb2plY3RfbmFtZTogZ2V0RGV2aWNlSW5mby5wcm9qZWN0X25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcl9kYXRlOiBnZXREZXZpY2VJbmZvLmVycm9yX2RhdGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIFNlbnQgZXJyb3IgYml0XHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfc2Vuc29yX1JUMSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfc2Vuc29yX0lNVF9TaVJTNDg1JzpcclxuXHRcdFx0XHRcdFx0XHQvLyBcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF9zZW5zb3JfSU1UX1RhUlM0ODUnOlxyXG5cdFx0XHRcdFx0XHRcdC8vIFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdFx0XHRcdC8vIGNhc2UgJyc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHQvLyBjYXNlICdtb2RlbF90ZWNoZWRnZSc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gY2FzZSAnbW9kZWxfaW52ZXJ0ZXJfR3Jvd2F0dF9HVzgwS1RMMyc6XHJcblx0XHRcdFx0XHRcdFx0Ly8gXHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgZXZlbnQgNFxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDRcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDQpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQ0JywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQ0IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0XHRcdC8vIH1cclxuXHJcblxyXG5cdFx0XHRcdFx0XHQvLyAvLyBjaGVjayBldmVudCA1XHJcblx0XHRcdFx0XHRcdC8vIGlmIChkZXZFdmVudC5oYXNPd25Qcm9wZXJ0eShcImV2ZW50NVwiKSAmJiAhTGlicy5pc0JsYW5rKGRldkV2ZW50LmV2ZW50NSkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQvLyBnZXQgZXJyb3IgaWRcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqUGFyYW1zID0geyBzdGF0ZV9rZXk6ICdldmVudDUnLCBlcnJvcl9jb2RlOiBkZXZFdmVudC5ldmVudDUgfTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRsZXQgb2JqRXJyb3IgPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuZ2V0RXJyb3JJbmZvXCIsIG9ialBhcmFtcyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0aWYgKG9iakVycm9yKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHQvLyBjaGVjayBhbGVydCBleGlzdHNcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGNoZWNrRXhpc3RBbGVybSA9IGF3YWl0IGRiLnF1ZXJ5Rm9yT2JqZWN0KFwiTW9kZWxSZWFkaW5ncy5jaGVja0V4aXN0QWxlcm1cIiwgeyBpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCB9KTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdGlmICghY2hlY2tFeGlzdEFsZXJtKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vIEluc2VydCBhbGVydFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRycyA9IGF3YWl0IGRiLmluc2VydChcIk1vZGVsUmVhZGluZ3MuaW5zZXJ0QWxlcnRcIiwge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGlkX2RldmljZTogZ2V0RGV2aWNlSW5mby5pZCwgaWRfZXJyb3I6IG9iakVycm9yLmlkLCBzdGFydF9kYXRlOiBkYXRhLnRpbWVzdGFtcCwgc3RhdHVzOiAxXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0Ly8gIENoZWNrIHNlbnQgbWFpbFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRpZiAoIUxpYnMuaXNCbGFuayhvYmpFcnJvci5pZF9lcnJvcl9sZXZlbCkgJiYgb2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwgPT0gMSAmJiAhTGlicy5pc0JsYW5rKGdldERldmljZUluZm8uZW1haWwpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGRhdGFBbGVydFNlbnRNYWlsID0ge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfY29kZTogb2JqRXJyb3IuZXJyb3JfY29kZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBvYmpFcnJvci5kZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdG1lc3NhZ2U6IG9iakVycm9yLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRzb2x1dGlvbnM6IG9iakVycm9yLnNvbHV0aW9ucyxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX3R5cGVfbmFtZTogb2JqRXJyb3IuZXJyb3JfdHlwZV9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfbGV2ZWxfbmFtZTogb2JqRXJyb3IuZXJyb3JfbGV2ZWxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGRldmljZV9uYW1lOiBnZXREZXZpY2VJbmZvLm5hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRwcm9qZWN0X25hbWU6IGdldERldmljZUluZm8ucHJvamVjdF9uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZnVsbF9uYW1lOiBnZXREZXZpY2VJbmZvLmZ1bGxfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVtYWlsOiBnZXREZXZpY2VJbmZvLmVtYWlsLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0ZXJyb3JfZGF0ZTogZ2V0RGV2aWNlSW5mby5lcnJvcl9kYXRlXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRsZXQgaHRtbCA9IHJlcG9ydFJlbmRlci5yZW5kZXIoXCJhbGVydC9tYWlsX2FsZXJ0XCIsIGRhdGFBbGVydFNlbnRNYWlsKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRTZW50TWFpbC5TZW50TWFpbEhUTUwobnVsbCwgZGF0YUFsZXJ0U2VudE1haWwuZW1haWwsICgnQ+G6o25oIGLDoW8gYuG6pXQgdGjGsOG7nW5nIGPhu6dhIFBWIC0gJyArIGRhdGFBbGVydFNlbnRNYWlsLnByb2plY3RfbmFtZSksIGh0bWwpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgZXZlbnQgNlxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDZcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDYpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQ2JywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQ2IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgZXZlbnQgN1xyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDdcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDcpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQ3JywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQ3IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0XHRcdFx0Ly8gLy8gY2hlY2sgZXZlbnQgOFxyXG5cdFx0XHRcdFx0XHQvLyBpZiAoZGV2RXZlbnQuaGFzT3duUHJvcGVydHkoXCJldmVudDhcIikgJiYgIUxpYnMuaXNCbGFuayhkZXZFdmVudC5ldmVudDgpKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0Ly8gZ2V0IGVycm9yIGlkXHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9ialBhcmFtcyA9IHsgc3RhdGVfa2V5OiAnZXZlbnQ4JywgZXJyb3JfY29kZTogZGV2RXZlbnQuZXZlbnQ4IH07XHJcblx0XHRcdFx0XHRcdC8vIFx0bGV0IG9iakVycm9yID0gYXdhaXQgZGIucXVlcnlGb3JPYmplY3QoXCJNb2RlbFJlYWRpbmdzLmdldEVycm9ySW5mb1wiLCBvYmpQYXJhbXMpO1xyXG5cdFx0XHRcdFx0XHQvLyBcdGlmIChvYmpFcnJvcikge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0Ly8gY2hlY2sgYWxlcnQgZXhpc3RzXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjaGVja0V4aXN0QWxlcm0gPSBhd2FpdCBkYi5xdWVyeUZvck9iamVjdChcIk1vZGVsUmVhZGluZ3MuY2hlY2tFeGlzdEFsZXJtXCIsIHsgaWRfZGV2aWNlOiBnZXREZXZpY2VJbmZvLmlkLCBpZF9lcnJvcjogb2JqRXJyb3IuaWQgfSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRpZiAoIWNoZWNrRXhpc3RBbGVybSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHQvLyBJbnNlcnQgYWxlcnRcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0cnMgPSBhd2FpdCBkYi5pbnNlcnQoXCJNb2RlbFJlYWRpbmdzLmluc2VydEFsZXJ0XCIsIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRpZF9kZXZpY2U6IGdldERldmljZUluZm8uaWQsIGlkX2Vycm9yOiBvYmpFcnJvci5pZCwgc3RhcnRfZGF0ZTogZGF0YS50aW1lc3RhbXAsIHN0YXR1czogMVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdC8vICBDaGVjayBzZW50IG1haWxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0aWYgKCFMaWJzLmlzQmxhbmsob2JqRXJyb3IuaWRfZXJyb3JfbGV2ZWwpICYmIG9iakVycm9yLmlkX2Vycm9yX2xldmVsID09IDEgJiYgIUxpYnMuaXNCbGFuayhnZXREZXZpY2VJbmZvLmVtYWlsKSkge1xyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdGxldCBkYXRhQWxlcnRTZW50TWFpbCA9IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2NvZGU6IG9iakVycm9yLmVycm9yX2NvZGUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogb2JqRXJyb3IuZGVzY3JpcHRpb24sXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRtZXNzYWdlOiBvYmpFcnJvci5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0c29sdXRpb25zOiBvYmpFcnJvci5zb2x1dGlvbnMsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlcnJvcl90eXBlX25hbWU6IG9iakVycm9yLmVycm9yX3R5cGVfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2xldmVsX25hbWU6IG9iakVycm9yLmVycm9yX2xldmVsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRkZXZpY2VfbmFtZTogZ2V0RGV2aWNlSW5mby5uYW1lLFxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdFx0cHJvamVjdF9uYW1lOiBnZXREZXZpY2VJbmZvLnByb2plY3RfbmFtZSxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGZ1bGxfbmFtZTogZ2V0RGV2aWNlSW5mby5mdWxsX25hbWUsXHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0XHRlbWFpbDogZ2V0RGV2aWNlSW5mby5lbWFpbCxcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0XHRcdGVycm9yX2RhdGU6IGdldERldmljZUluZm8uZXJyb3JfZGF0ZVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0bGV0IGh0bWwgPSByZXBvcnRSZW5kZXIucmVuZGVyKFwiYWxlcnQvbWFpbF9hbGVydFwiLCBkYXRhQWxlcnRTZW50TWFpbCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRcdFx0U2VudE1haWwuU2VudE1haWxIVE1MKG51bGwsIGRhdGFBbGVydFNlbnRNYWlsLmVtYWlsLCAoJ0PhuqNuaCBiw6FvIGLhuqV0IHRoxrDhu51uZyBj4bunYSBQViAtICcgKyBkYXRhQWxlcnRTZW50TWFpbC5wcm9qZWN0X25hbWUpLCBodG1sKTtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmICghcnMpIHtcclxuXHRcdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0XHRjYWxsQmFjayhmYWxzZSwge30pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Y29ubi5jb21taXQoKTtcclxuXHRcdFx0XHRcdGNhbGxCYWNrKHRydWUsIHJzKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTOG7l2kgcm9sYmFja1wiLCBlcnIpO1xyXG5cdFx0XHRcdFx0Y29ubi5yb2xsYmFjaygpO1xyXG5cdFx0XHRcdFx0Y2FsbEJhY2soZmFsc2UsIGVycik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2Vycm9yJywgZSk7XHJcblx0XHRcdGNhbGxCYWNrKGZhbHNlLCBlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IERhdGFSZWFkaW5nc1NlcnZpY2U7XHJcbiJdfQ==