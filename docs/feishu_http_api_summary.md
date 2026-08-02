# Core API Protocol - HTTP API Summary

Source: public Feishu wiki `Core API Protocol / HTTP API` crawled on 2026-04-19 (Asia/Shanghai).

Scope: only the `HTTP API` subtree, excluding sibling spaces such as `Modbus API`, `RDSCore Model File Configurations`, and `Common Resources`.

## Module Index

- Action Blocks: 5 pages
- Container: 4 pages
- Device-related: 23 pages
- Machine vision bin management: 1 pages
- Mutual Block Group: 12 pages
- Order: 17 pages
- Overview: 1 pages
- Parameter Configuration: 4 pages
- Robot-related: 30 pages
- Routes and Sites: 8 pages

## Notes

- Base URL from `Overview`: `http://<host>:8088/`.
- Some pages are conceptual (`Overview`, `General Protocol`) rather than single REST endpoints.
- The tables below are condensed from the public wiki page text; for request/response schemas and examples, the source page still has more detail.

## Action Blocks

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Add Blocks to Order | POST | /addBlocks |  |
| Manual Finish Blocks | POST | /manualFinished |  |
| Paging Query Action Block Information | GET | /blocks | Query the action blocks in the system through parameter paging. The page and size in the query parameters are examples, which means this interface can filter and sort in multiple ways. |
| Query Block Details by Block ID | GET | /blockDetailsById/{blockId} |  |
| Redo Failed Blocks | POST | /redoFailedOrder | redo failed blocks |

## Container

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Bind Goods to Specified Containers | POST | /setContainerGoods | Bind the goods to the specified container. This interface is only effective for robots with containers configured in the robot model file. The relevant information of the container can be obtained in the containers field of the robot information. |
| Unbind Goods from All Containers | POST | /clearAllContainersGoods | Unbind goods from all containers. This interface is only effective for robots with containers configured in the robot model file. The relevant information of the bins can be obtained in the containers field of the robot information. |
| Unbind Goods from Specified Containers | POST | /clearContainer | Unbind the goods from the specified container. This interface is only effective for robots with containers configured in the robot model file. The relevant information of the container can be obtained in the containers field of the robot information. |
| Unbind Specified Goods | POST | /clearGoods | Unbind specified goods. This interface only takes effect for robots with containers configured in the robot model file. The information about the material box can be obtained in the containers field of the robot information. |

## Device-related

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Proxy Modbus TCP Request | POST | /modbusProxyRequest | Use Core connections to proxy Modbus TCP requests to avoid problems caused by too many connections. |
| Query Device Status | GET | /devicesDetails | Query device status. |

### Automatic Door

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Automatic Door Command History Query | GET | /trace/doorCommand/{doorName} | Query instructions for automatic doors. |
| Disable Automatic Door | POST | /disableDoor | Disable on-site door equipment. After disabling, the vehicle will not use the disabled door. |
| Interact with Automatic Doors | POST | /callDoor | Control automatic door equipment on site. |

### Fire Alarm Area

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Acquire Fire Alarm Status | GET | /isFire | Get the status of fire alarm and fire area. |
| Interact with Fire | POST | /fireOperations | Trigger fire alarm fire area. |

### Lift

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Disable Lift | POST | /disableLift | Disable the on-site lift equipment, and the vehicle will not use the disabled lift after it is disabled. |
| Interact with Lift | POST | /callLift | Control the lift equipment on site. |

### Off-duty Standby Area

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Get on/off Duty Status | GET | /isOnDuty | Get on/off duty status. |
| Modify on/off Duty Status | POST | /dutyOperations | Modify on/off duty status. |

### Storage Bin

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Check Storage Bin Validity | POST | /binCheck | Query the validity of the storage bin in the scenario. |
| Query Storage Bin Status | GET | /binDetails | Query the status of the storage bin in the scenario. |

### Terminal

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Interact with Proxy Type Terminals |  | /callTerminal | For RDSCoreto interact with field terminal devices. |

### Terminal / Interact with ExtendedProxy Type Terminals

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Query Extended Robot Register Status Values | POST | /getExtendedRobotStatus | Query the status of the extended robot register. |
| Query Extended Terminal Register Status | POST | /getExtendedTerminalStatus | Query the status of the extended vehicle register. |
| Set Extended Terminals Register Value | POST | /setExtendedTerminalStatus | Set vehicle status. |
| Set the Extended Robot Register Value | POST | /setExtendedRobotStatus | Set vehicle status. |

### Terminal / Interact with Slave Type Terminals

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Query Device Status | POST | /getTerminalStatus | Check device status. |
| Query the Status of the Robot | POST | /getRobotStatus | Query the status of the robot. |
| Set Device Status | POST | /setTerminalStatus | Set device status. |
| Set Robot Status | POST | /setRobotStatus | Set robot status. |

### Windshower

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Interact with Windshower | POST | /callWindShower | Control windshower. |

## Machine vision bin management

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| General Protocol |  |  | Concept/overview page |

## Mutual Block Group

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Continue Robot Navigation in the Mutual Block Zone | POST | /resumeRobotsInBlock | Continue the navigation of the robot in a mutual block area. |
| Get the List of Robots in the Mutual Block Area | GET | /getRobotsInBlock | Get a list of robots in the specified mutual block area. |
| Occupy Mutual Block Group | POST | /getBlockGroup | Occupy mutual exclusion group. |
| Pause Robot Navigation in Mutual Block Area | POST | /pauseRobotsInBlock | Pause the navigation of robots in a mutual block area. |
| Query External Mutual Block Group Request History | GET | /trace/otherSysBlockGroup | Query the request history of a specified robot or mutual block group over a period of time. |
| Query Mutual Block Group Occupancy History | GET | /blockGroupOwnerTrace | Query the historical status of each mutual block group being occupied. |
| Query Mutual Block Group Status | POST | /blockGroupStatus | Query the status of a specified mutual exclusion group. |
| Query a List of Robots in an Array | POST | /robotsInCountGroup | Query the status of an array. |
| Query a list of robots in an array | POST | /robotsInCountGroup | Query the status of an array |
| Release Mutual Block Group | POST | /releaseBlockGroup | Release the specified mutual block group. |
| Remove Area Blockade | POST | /delAreaState | Remove area blockade. |
| Set Area Blockade | POST | /setAreaState | Set blocked areas. |

## Order

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Batch Delete Orders | POST | /deleteAllOrders | Batch delete orders, only the orders with status STOPPED and FINISHED can be deleted |
| Clear Order Cache | POST | /clearCache | Clear the database waybill cache, which can clear the waybill cache before the specified timestamp. |
| Create Cleaning Order | POST | /setOrder | Create Combination Sheets |
| Create Join Order |  |  |  |
| Create Order | POST | /setOrder | create order by unique order id |
| Delete Single Order | POST | /deleteOrder | Delete a single order, only the orders with status STOPPED and FINISHED can be deleted. |
| Issue Charging Order | POST | /setChargeOrder | Issue charging tasks to designated robots. When scheduling charging tasks, it will directly charge at available charging piles regardless of the battery level of the robot. Constraints such as chargeNeed and chargeOnly are not considered. |
| Mark Order Complete | POST | /markComplete | The order is completed. After that, new blocks cannot be added. |
| Modify Order Label | POST | /setLabel | When the current order does not have a robot assigned, you can issue and modify the label of the order to adjust the car selection range. |
| Modify Order Priority | POST | /setPriority | When the current order does not have a robot assigned, the priority of the order can be modified |
| Paging Query Orders | GET | /orders | Query the orders in the system through paging parameters. The page and size in the query parameters are examples, that is, this interface can be filtered and sorted in various ways. |
| Query Cleaning Order |  |  |  |
| Query Order Details by Block ID | GET | /orderDetailsByBlockId/{blockId} | Query order details by block id |
| Query Order Details by External ID | GET | /orderDetailsByExternalId/{externalId} | Query order details by external id |
| Query Order Details with ID | GET | /orderDetails/{id} | Query order details by order id |
| Redistribute Order | POST | /unassignOrder | Reassign unexecuted orders according to the order id ; or reassign all orders that have not been executed by the current robot according to the robot name. |
| Terminate Order | POST | /terminate | Terminate the order with a specific id, or terminate the current order/all orders of the specified robot |

## Overview

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Overview |  |  | Concept/overview page |

## Parameter Configuration

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Permanently Modify Parameters | POST | /saveCoreParam | Permanently modify parameters. Version: 0.1.9.240329 or above. |
| Query Parameters | POST | /getCoreParam | Query robot parameters. Version: 0.1.9.240329 or above. |
| Restore Parameters to Default Values | POST | /reloadCoreParam | Restore parameters to default values. Version: 0.1.9.240329 or above. |
| Temporarily Modify Parameters | POST | /setCoreParam | Temporarily modify robot parameters. Version: 0.1.9.240329 or above. |

## Robot-related

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Clear Robot Error | POST | /clearRobotAllError | Clear errors reported by the robot. |
| Clear Robot Third-party Errors | POST | /clear3rdError | Clear third-party errors in the robot. |
| Configure Robot Dispatchable Status | POST | /dispatchable |  |
| Confirm Relocalization | POST | /reLocConfirm |  |
| Confirm Robot Localization | POST | /reLocConfirm | Confirm the positioning status of the specified robot. |
| Get Simulator State Template List | GET | /getSimRobotStateTemplate |  |
| Get the Modifiable Status List of the Simulation Robot | GET | /getSimRobotStateTemplate | Get the modifiable status list of the simulation robot. |
| Inquire Robot Status | GET | /robotsStatus |  |
| Obtain Specific Robot Map | GET | /robotSmap |  |
| Pause Navigation | POST | /gotoSitePause |  |
| Pause Robot Navigation | POST | /gotoSitePause | Pause the robot's navigation. |
| Permanent Modification of Robot Parameters | POST | /saveParams |  |
| Preempt the Robot's Control | POST | /lock |  |
| Query Robot Charging Parameters | GET | /getChargeParam | Query robot charging parameters |
| Query Robot Load Rate | POST | /report/loadrate | Query the ratio of the robot's loading time to the total time. |
| Release the Control | POST | /unlock |  |
| Request Robot General API | POST | /generalRobokitAPI | Universal interface for requesting robot TCP API |
| Restore Robot Parameter Defaults | POST | /reloadParams |  |
| Resume Navigation | POST | /gotoSiteResume |  |
| Robot Relocation | POST | /reloc | Relocate the robot |
| Set Robot Control Motion | POST | /controlMotion | Set the control motion of the robot. |
| Set Robot Fork Height | POST | /setForkHeight | Set the height of the robot fork |
| Set Robot Soft Emergency Stop | POST | /setSoftIOEMC | Set robot soft emergency stop |
| Set Robot Third-party Error | POST | /set3rdError | Set third-party errors for robots. |
| Set Robot Third-party Warning | POST | /set3rdWarning | Set third-party warnings for robots. |
| Set the IO status of the Robot | POST | /setRobotIO | Set the IO status of the robot |
| Stop the Robot Fork | POST | /stopFork | Stop the robot fork |
| Switch Robot Map | POST | /switchMap |  |
| Temporary Modification of Robot Parameters | POST | /setParams |  |
| Update Simulation Robot States | POST | /updateSimRobotState |  |

## Routes and Sites

| API | Method | Path | Function / Notes |
| --- | --- | --- | --- |
| Disable Point | POST | /disablePoint | Disable a certain point in the scene from passing. |
| Disable Route | POST | /disablePath | Disable a certain route from passing through the scene. |
| Enable Point | POST | /enablePoint | Enable the point that is disabled to pass in the scene. |
| Enable Route | POST | /enablePath | Enable the disabled routes in the scene. |
| Query Connected Component | POST | /queryConnectivity | Query the connected components in the scene. |
| Query Disabled Points | GET | /getDisablePoints | Query the disabled point in the scene. |
| Query Disabled Routes | GET | /getDisablePaths | Query the disabled route in the scene. |
| Query the Distance from the Robot to the Point | POST | /queryDist | Query the distance from the current position of the robot to a given point. |
