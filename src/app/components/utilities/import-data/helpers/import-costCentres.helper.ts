import { Observable } from 'rxjs';
import { CostCentre } from 'src/app/models/costCentre';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';

export class ImportCostCentresHelper {

  fieldNames: string[];

  constructor(
    private service: CostCentresService
  ) { }

  import(data): Observable<CostCentre[]> {
    const me = this;
    var costCentre: CostCentre,
        costCentresToSave: CostCentre[] = [],
        nameIndex,
        companyIndex,
        descriptionIndex,
        activeIndex;

    me.fieldNames = data[0];
    nameIndex = me.fieldNames.indexOf('Name');
    companyIndex = me.fieldNames.indexOf('Company');
    descriptionIndex = me.fieldNames.indexOf('Description');
    activeIndex = me.fieldNames.indexOf('Active');

    for (var f=1; f<data.length; f++)
    {
      var rowData = data[f];

      costCentre = new CostCentre;
      costCentre.name = rowData[nameIndex];
      costCentre.company = rowData[companyIndex];
      costCentre.description = rowData[descriptionIndex];
      costCentre.active = rowData[activeIndex].trim() === 'true' ? true : false;
      costCentre.updated = new Date();
      costCentre.created = new Date();

      costCentresToSave.push(costCentre);
    }

    return me.service.createCostCentres(costCentresToSave);
  }
};