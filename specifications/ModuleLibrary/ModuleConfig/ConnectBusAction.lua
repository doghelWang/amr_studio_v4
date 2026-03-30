local json = require ("dkjson")


function PrintMessage(data)
    print("\n\n")
    print(json.encode(data, {indent = "  "}))
end

local ConnectHandler = {
    CAN = function (port1, port2)
        local protocol1 = ""
        local protocol2 = ""
        for index, value in ipairs(port1.interfaceParams.interfaceParamsArray) do
            if value.key == "protocol" then
                protocol1 = value.comboType.typeKey
            end
        end
        for index, value in ipairs(port2.interfaceParams.interfaceParamsArray) do
            if value.key == "protocol" then
                protocol2 = value.comboType.typeKey
            end
        end
        local start1, finish1 = string.find(protocol1, protocol2)
        local start2, finish2 = string.find(protocol2, protocol1)
        return start1 or start2
    end, 
    ETH = function (port1, port2)
        return true
    end
}

function ConnectBusAction(info1, info2)
    local port1, pos1, err1 = json.decode(info1)
    local port2, pos2, err2 = json.decode(info2)
    if port1.type ~= port2.type then
        return false
    end
    local ret = false
    if ConnectHandler[port1.type] then
        ret = ConnectHandler[port1.type](port1, port2)
    end
    return ret
end