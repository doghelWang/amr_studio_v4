local json = require ("dkjson")

-- local interfaces = {
--     "PI", "PO", "DI0", "DO0", 
--     "AI", "CAN", "ETH", "USB", 
--     "RS232", "RS485", "RS422", 
--     "SPI", "HDMI", "LVDS", "UART", 
--     "LIN", "LINE", "ENCR", "SPK", 
--     "SMA", "BAR", "GRAV", "BAT", 
--     "DI1", "DO1", "PZTB", "AO"
-- }
local interfaceDict = {
    ["PI"] = "PO",
    ["DI0"] = "PO0",
    ["AI"] = "AO",
    ["DI1"] = "DO1",
    ["DI"] = "DO",
    
    ["PO"] = "PI",
    ["DO0"] = "PI0",
    ["AO"] = "AI",
    ["DO1"] = "DI1",
    ["DO"] = "DI"
}

local portHandler = {
    ENCR = function (msg1, msg2)
        local arr1 = msg1.interfaceAttrs.interfaceParamsArray
        local arr2 = msg2.interfaceAttrs.interfaceParamsArray
        for index, value in ipairs(arr1) do
            if value.key == "MODE" then
                return arr1[index].comboType.typeKey == arr2[index].comboType.typeKey
            end
        end
        return false
    end
}

function PrintMessage(data)
    print("\n\n")
    print(json.encode(data, {indent = "  "}))
end


function ConnectAction(port1, port2)
    local ret = false
    if interfaceDict[port1.name] == nil then
        ret = port1.name == port2.name
    else
        ret = interfaceDict[port1.name] == port2.name
    end
    local msg1, pos1, err1 = json.decode(port1.message)
    local msg2, pos2, err2 = json.decode(port2.message)
    if msg1.type == msg2.type then
        if portHandler[msg1.type] then
            ret = portHandler[msg1.type](msg1, msg2)
        end
    end
    ret =   ret and 
            port1.connectNum == 0 and 
            port2.connectNum == 0 and 
            port1.linkID ~= port2.linkID and
            port1.node.instanceID ~= port2.node.instanceID and
            port1.node.type ~= port2.node.type and 
            (port1.node.type + port2.node.type) ~= (NodeType.CPU + NodeType.Board)
    return ret
end

