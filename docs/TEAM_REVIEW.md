# AMR Studio Pro V4 — All-Hands Joint Review

**Review Time**: 2026-03-12 07:53:11
**Trigger**: URGENT: Requirement Update Detected

## 1. Team Deliverables
* **Build Artifacts**: 4 ZIP Models updated and validated.
* **Core Engine**: Verified recursive interface mapping and dynamic IO counting.
* **Consistency**: Round-trip validation complete.

## 2. Technical Audit Summary
* **Architect**: Schema parity verified.
* **Tester**: Interface alignment check: OK (Total Channels: 18).

---
*Status: ✅ STABLE*

AMR设计软件（web）的问题分析

1、逻辑性：

    要求：构建一台AMR，需要先明确AMR的类型以及选用的主控制器型号；

    所以：

    第一步   填写AMR的基础信息：

####         包括：导航定位形式、底盘类型；

        （此时将会自动生成一个半成品底盘模块，缺少尺寸信息、属性信息）

    第二步    选择AMR主控制器和扩展IO模块：

           根据已经设定的底盘类型，筛选出可以应用在该类型下的控制器型号，供用户选择；

            比如：舵轮底盘，只能选择R318-AT的型号，差速底盘则可以选择所有型号；

            选择可用的IO模块；

            可以查看控制器和IO模块的资源表情况；

            （请注意，每个模块均是一个独立模块对象）

    第三步    填写底盘、轮组、驱动、电机、编码器的信息：

            将底盘和轮组信息区分开描述，底盘主要描述其尺寸信息、私有属性信息；

            轮组填写的时候，在一个界面，对于一个轮子，填写其轮组的属性信息、驱动器信息、电机属性信息、编码器属性信息；

            请注意：以上轮子、驱动器、电机均会产生对应的模块对象和从属关系。而编码器，如果是电机内置，则不产生对象（作为电机的参数信息），如果是外置的，则应存在一个外置编码器对象；

            特别注意：需要进行转向限位的轮组，需要在限位处选择或增加限位传感器/零位传感器）

            请注意：所有模块对象都有一个独立的名字字段，需要进行默认生成，对于编码器和驱动这类后续可能会进行独立控制器的，需要能够人工自定义修改；

    第四步    填写激光、读码相机、双目等导航避障传感器的信息

    第五步    填写电池、显示屏模块

    第六步    填写IO相关的器件（急停按键、零位传感器、接近开关等等）

    第七步    增加其他独立部件（分类型添加，包括：网络设备、传感器、IO部件、CAN总线设备等）    

    2、成果物验证：

    构建后的cmodel文件应该包含4个内容：

    abiset.model CompDesc.model FuncDesc.model 和ModelFileDesc.json

    其中：CompDesc.model 即protobuf序列化后的文件，序列化前应参考类似下图的json文件。

    同理于其他文件；
