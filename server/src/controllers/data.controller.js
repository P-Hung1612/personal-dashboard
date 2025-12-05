import { dataService } from "../services/data.service.js";

export const getData = (req, res) => {
    return res.json(dataService.getData(req.user.email));
};

export const saveData = (req, res) => {
    dataService.saveData(req.user.email, req.body);
    res.json({ success: true });
};

export const generateDemoData = (req, res) => {
    const data = dataService.generateDemo(req.user.email);
    res.json({ success: true, data });
};
