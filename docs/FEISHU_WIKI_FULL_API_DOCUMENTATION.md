# Feishu Wiki Full API Documentation

Source root: [Feishu Wiki Full Space](https://seer-group.feishu.cn/wiki/QdCIwrnFkiTeirkqrnTcF8gln6g)
Total Leaf Pages Analyzed: 127

## Table of Contents
- [Module Index](#module-index)
- [Common Resources](#common-resources)
- [Core API Protocol](#core-api-protocol)
- [HTTP API](#http-api)
  - [Action Blocks](#action-blocks)
  - [Container](#container)
  - [Device-related](#device-related)
  - [Machine vision bin management](#machine-vision-bin-management)
  - [Mutual Block Group](#mutual-block-group)
  - [Order](#order)
  - [Parameter Configuration](#parameter-configuration)
  - [Robot-related](#robot-related)
  - [Routes and Sites](#routes-and-sites)
- [Modbus API](#modbus-api)
- [RDSCore Model File Configurations](#rdscore-model-file-configurations)

---

## Module Index

- **Common Resources**: 1 pages
- **Core API Protocol**: 1 pages
- **HTTP API**: 105 pages
- **Modbus API**: 1 pages
- **RDSCore Model File Configurations**: 19 pages

---

## Common Resources

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Smap Map Format File Parsing | - | - | Concept/overview page detailing map parsing |

## Core API Protocol

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Core API Protocol | - | - | General API architecture and guidelines |

---

## HTTP API

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Overview | - | - | General Protocol Concept/overview page |

### Action Blocks

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Add Blocks to Order | POST | `/addBlocks` | Add action blocks sequentially |
| Manual Finish Blocks | POST | `/manualFinished` | Manually finish blocks for normal or container vehicles |
| Paging Query Action Block Information | GET | `/blocks` | Query the action blocks in the system through parameter paging. Supports advanced filtering with `AND`/`OR`. |
| Query Block Details by Block ID | GET | `/blockDetailsById/{blockId}` | Query action block status by unique action block ID |
| Redo Failed Blocks | POST | `/redoFailedOrder` | Redo failed blocks of specific vehicles |

### Container

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Bind Goods to Specified Containers | POST | `/setContainerGoods` | Bind the goods to the specified container defined in the robot model |
| Unbind Goods from All Containers | POST | `/clearAllContainersGoods` | Clear all bound goods across containers |
| Unbind Goods from Specified Containers | POST | `/clearContainer` | Clear specific container binding |
| Unbind Specified Goods | POST | `/clearGoods` | Unbind specific goods globally |

### Device-related

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Proxy Modbus TCP Request | POST | `/modbusProxyRequest` | Proxy Modbus TCP requests via Core to avoid connection limits |
| Query Device Status | GET | `/devicesDetails` | Retrieve overall device statuses |

#### Sub-devices interact

| Device Type | API | Method | Path | Function / Notes |
| --- | --- | --- | --- | --- |
| **Automatic Door** | Automatic Door Command History Query | GET | `/trace/doorCommand/{doorName}` | Trace door interaction history |
| **Automatic Door** | Disable Automatic Door | POST | `/disableDoor` | Disable on-site door routing |
| **Automatic Door** | Interact with Automatic Doors | POST | `/callDoor` | Trigger open/close logic |
| **Fire Alarm Area**| Acquire Fire Alarm Status | GET | `/isFire` | Check fire alarm area state |
| **Fire Alarm Area**| Interact with Fire | POST | `/fireOperations` | Trigger fire alarm in the system |
| **Lift** | Disable Lift | POST | `/disableLift` | Disallow lift routing |
| **Lift** | Interact with Lift | POST | `/callLift` | Control lift equipment |
| **Off-duty Standby**| Get on/off Duty Status | GET | `/isOnDuty` | Read duty status |
| **Off-duty Standby**| Modify on/off Duty Status | POST | `/dutyOperations` | Write duty status |
| **Storage Bin** | Check Storage Bin Validity | POST | `/binCheck` | Validate scenarios container bin |
| **Storage Bin** | Query Storage Bin Status | GET | `/binDetails` | - |
| **Windshower** | Interact with Windshower | POST | `/callWindShower` | Control windshower state |

#### Terminal Devices

**Proxy Type Terminals:**
| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Interact with Proxy Type Terminals| (System) | `/callTerminal` | General proxy interaction routing |

**ExtendedProxy Type Terminals:**
| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Query Extended Robot Register Status Values | POST | `/getExtendedRobotStatus` | Extended robot registers |
| Query Extended Terminal Register Status | POST | `/getExtendedTerminalStatus` | Extended terminal registers |
| Set Extended Terminals Register Value | POST | `/setExtendedTerminalStatus` | Modify terminal states |
| Set the Extended Robot Register Value | POST | `/setExtendedRobotStatus` | Modify robot states |

**Slave Type Terminals:**
| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Query Device Status | POST | `/getTerminalStatus` | Slave: query device |
| Query the Status of the Robot | POST | `/getRobotStatus` | Slave: query robot |
| Set Device Status | POST | `/setTerminalStatus` | Slave: modify device |
| Set Robot Status | POST | `/setRobotStatus` | Slave: modify robot |

### Machine vision bin management

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| General Protocol | - | - | Concept/overview page |

### Mutual Block Group

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Continue Robot Navigation in the Mutual Block Zone | POST | `/resumeRobotsInBlock` | Resume block group navigation |
| Get the List of Robots in the Mutual Block Area | GET | `/getRobotsInBlock` | List robots currently inside block |
| Occupy Mutual Block Group | POST | `/getBlockGroup` | Explicitly seize block group |
| Pause Robot Navigation in Mutual Block Area | POST | `/pauseRobotsInBlock` | Pause block group navigations |
| Query External Mutual Block Group Request History | GET | `/trace/otherSysBlockGroup` | View trace history of external requests |
| Query Mutual Block Group Occupancy History | GET | `/blockGroupOwnerTrace` | Historical status of occupancy |
| Query Mutual Block Group Status | POST | `/blockGroupStatus` | Get group status |
| Query a List of Robots in an Array | POST | `/robotsInCountGroup` | Array count query |
| Release Mutual Block Group | POST | `/releaseBlockGroup` | Explicitly release ownership |
| Remove Area Blockade | POST | `/delAreaState` | Lift restriction |
| Set Area Blockade | POST | `/setAreaState` | Add area restriction |

### Order

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Batch Delete Orders | POST | `/deleteAllOrders` | Batch delete orders (only STOPPED and FINISHED) |
| Clear Order Cache | POST | `/clearCache` | Clear database waybill cache |
| Create Cleaning Order | POST | `/setOrder` | Combinatory sheet creation |
| Create Order | POST | `/setOrder` | Standard creation by unique ID |
| Delete Single Order | POST | `/deleteOrder` | Delete single order (only STOPPED/FINISHED) |
| Issue Charging Order | POST | `/setChargeOrder` | Issue charging tasks ignoring thresholds |
| Mark Order Complete | POST | `/markComplete` | Force order completion (blocks further addition) |
| Modify Order Label | POST | `/setLabel` | Adjust robot selection range |
| Modify Order Priority | POST | `/setPriority` | Raise/lower priority dynamically |
| Paging Query Orders | GET | `/orders` | View system orders sequentially |
| Query Order Details by Block ID | GET | `/orderDetailsByBlockId/{blockId}`| Relational Query |
| Query Order Details by External ID| GET | `/orderDetailsByExternalId/{extId}` | Relational Query |
| Query Order Details with ID | GET | `/orderDetails/{id}` | Direct order lookup |
| Redistribute Order | POST | `/unassignOrder` | Re-assign orders or pull from failed current robot |
| Terminate Order | POST | `/terminate` | Terminate specific ID or all current of a robot |

*(Note: Create Join Order / Query Cleaning Order do not have explicitly documented REST mappings but exist in the wiki hierarchy)*

### Parameter Configuration

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Permanently Modify Parameters | POST | `/saveCoreParam` | Write permanently to configuration |
| Query Parameters | POST | `/getCoreParam` | Read current active config |
| Restore Parameters to Default Values | POST | `/reloadCoreParam` | Overwrite active with default |
| Temporarily Modify Parameters | POST | `/setCoreParam` | Modify memory state temporarily |

### Robot-related

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Clear Robot Error | POST | `/clearRobotAllError` | Clear native errors |
| Clear Robot Third-party Errors | POST | `/clear3rdError` | Clear 3rd party faults |
| Configure Robot Dispatchable Status | POST | `/dispatchable` | Modify state |
| Confirm Robot Localization | POST | `/reLocConfirm` | Relocalization verification |
| Get Simulator State Template List | GET | `/getSimRobotStateTemplate`| Simulator templates |
| Inquire Robot Status | GET | `/robotsStatus` | Poll status |
| Obtain Specific Robot Map | GET | `/robotSmap` | Fetch specific associated map |
| Pause Robot Navigation | POST | `/gotoSitePause` | Intercept routing |
| Permanent Modification of Robot Parameters | POST | `/saveParams` | Robot-specific parameter persist |
| Preempt the Robot's Control | POST | `/lock` | Overwrite current host lock |
| Query Robot Charging Parameters | GET | `/getChargeParam` | Battery specs and requirements |
| Query Robot Load Rate | POST | `/report/loadrate` | Efficiency loading time tracking |
| Release the Control | POST | `/unlock` | Lift host lock |
| Request Robot General API | POST | `/generalRobokitAPI` | Universal TCP API Request Bridge |
| Restore Robot Parameter Defaults | POST | `/reloadParams` | Restore Robot-specific parameter defaults |
| Resume Navigation | POST | `/gotoSiteResume` | Reinstate routing |
| Robot Relocation | POST | `/reloc` | Set localization manually |
| Set Robot Control Motion | POST | `/controlMotion` | Chassis movement manipulation |
| Set Robot Fork Height | POST | `/setForkHeight` | Manipulator |
| Set Robot Soft Emergency Stop | POST | `/setSoftIOEMC` | SCADA layer safety trigger |
| Set Robot Third-party Error | POST | `/set3rdError` | External injection |
| Set Robot Third-party Warning | POST | `/set3rdWarning`| External injection |
| Set the IO status of the Robot | POST | `/setRobotIO` | Direct pin output |
| Stop the Robot Fork | POST | `/stopFork` | Manipulator interrupt |
| Switch Robot Map | POST | `/switchMap` | Multi-floor/map capability |
| Temporary Modification of Robot Parameters | POST | `/setParams` | Robot-specific memory persist |
| Update Simulation Robot States | POST | `/updateSimRobotState` | Simulator override |

### Routes and Sites

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Disable Point | POST | `/disablePoint` | Exclude vertex from global pathfinding |
| Disable Route | POST | `/disablePath` | Exclude edge from global pathfinding |
| Enable Point | POST | `/enablePoint` | Reinstate vertex |
| Enable Route | POST | `/enablePath` | Reinstate edge |
| Query Connected Component | POST | `/queryConnectivity` | Validate graph reaches |
| Query Disabled Points | GET | `/getDisablePoints` | Listed omitted vertices |
| Query Disabled Routes | GET | `/getDisablePaths` | Listed omitted edges |
| Query the Distance from the Robot to the Point | POST | `/queryDist` | Node-to-Node cost estimate |

---

## Modbus API

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Mutex Area | (Protocol) | TCP 502 | Modbus registers assigned for mutex intersection rules |

---

## RDSCore Model File Configurations

| Section | API | Method | Path | Function / Notes |
| --- | --- | --- | --- | --- |
| **Alarms** | Configure Error Code Email Alarm | - | - | Notification policies via Email |
| **Alarms** | Configure Error Code SMS Alarm | - | - | Notification policies via SMS |
| **Stations** | Configure SRC800 Charging Station | - | - | Hardware-specific profile loading |
| **Callbacks** | Reporting Completion of Action Blocks | - | - | Webhook integration specs |
| **Callbacks** | Status Callback for Join Order | - | - | Webhook integration specs |
| **RDSCore Internals** | Connectivity Test | GET | `/ping` | Sanity check |
| **RDSCore Internals** | Download Scenes | GET | `/downloadScene` | Scene bundle extract |
| **RDSCore Internals** | Download Specified Files in Scene Pack | POST | `/downloadSceneFiles` | Partial extract |
| **RDSCore Internals** | Get Configuration File | POST | `/getProfiles` | Pull config JSON |
| **RDSCore Internals** | Get License Details | GET | `/licInfo` | Key validation parsing |
| **RDSCore Internals** | Get Scene Details | GET | `/scene` | Scene metadata extraction |
| **RDSCore Internals** | Restore Scene | POST | `/syncScene` | Factory reset or template roll |
| **RDSCore Internals** | Upload Scenes | POST | `/uploadScene` | Overwrite scene bundle |
| **RDSCore Guidelines**| Configure G-MAPF Common Parameters... | - | - | Setup Wizard |
| **RDSCore Guidelines**| Multiple Robots in the Same Area | - | - | Modbus TCP strategy |
| **RDSCore Guidelines**| Modify Model and Parameters | - | - | - |
| **RDSCore Guidelines**| Multi-Agent Path Finding Reference | - | - | Theoretical details |
| **RDSCore Guidelines**| Resource Occupation Strategy for Mutual Exclusion | - | - | Map locking semantics |
| **RDSCore Guidelines**| Terminate Unloading Order & Place | - | - | Custom routine description |
